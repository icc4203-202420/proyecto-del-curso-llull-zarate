class API::V1::EventsController < ApplicationController
  include Authenticable
  respond_to :json
 
  before_action :set_event, only: [:show, :update, :destroy, :attend_event]
  before_action :verify_jwt_token, only: [:create, :update, :destroy, :attend_event]

  def index
    events = Event.all.includes(:bar)
    render_success({ events: events.as_json(include: { bar: { only: :name } }) })
  end

  def show
    event_json = @event.as_json(
      include: {
        bar: {
          only: :name,
          include: {
            address: { only: [:line1, :line2, :city] }
          }
        },
        users: { only: [:id, :first_name, :last_name, :email, :handle] },
        event_pictures: {
          only: [:id, :description],
          include: {
            user: { only: [:id, :first_name, :last_name] }
          }
        }
      }
    )
    event_json[:flyer_url] = url_for(@event.flyer) if @event.flyer.attached?
    render_success({ event: event_json })
  end

  def create
    @event = Event.new(event_params.except(:image_base64))
    @event.user = current_user
    handle_image_attachment if event_params[:image_base64]

    if @event.save
      render_success({ event: @event, message: 'Event created successfully.' }, status: :created)
    else
      render_error(@event.errors.full_messages)
    end
  end

  def update
    handle_image_attachment if event_params[:image_base64]

    if @event.update(event_params.except(:image_base64))
      render_success({ event: @event, message: 'Event updated successfully.' })
    else
      render_error(@event.errors.full_messages)
    end
  end

  def destroy
    if @event.destroy
      render_success({ message: 'Event successfully deleted.' })
    else
      render_error(@event.errors.full_messages)
    end
  end

  def attend_event
    attendance = Attendance.new(user: current_user, event: @event)

    if attendance.save
      render_success({ message: 'You have confirmed your attendance.' })
    else
      render_error(attendance.errors.full_messages)
    end
  end

  private

  def set_event
    @event = Event.find_by(id: params[:id])
    render_error('Event not found', status: :not_found) unless @event
  end

  def event_params
    params.require(:event).permit(:name, :description, :date, :location, :bar_id, :image_base64)
  end

  def handle_image_attachment
    if event_params[:image_base64].present?
      begin
        decoded_image = decode_image(event_params[:image_base64])
        @event.image.attach(io: decoded_image[:io], filename: decoded_image[:filename], content_type: decoded_image[:content_type])
      rescue => e
        Rails.logger.error("Image attachment failed: #{e.message}")
        render_error('Image upload failed')
      end
    end
  end

  def decode_image(image_base64)
    content_type = image_base64[%r{data:(.*?);base64}, 1]
    encoded_image = image_base64.split(',')[1]
    decoded_image = Base64.decode64(encoded_image)
    io = StringIO.new(decoded_image)
    filename = "event_image_#{SecureRandom.uuid}.#{content_type.split('/').last}"

    { io: io, filename: filename, content_type: content_type }
  rescue => e
    raise "Invalid image format: #{e.message}"
  end

  def verify_jwt_token
    authenticate_user!
    head :unauthorized unless current_user
  end

  def render_success(data, status: :ok)
    render json: data, status: status
  end

  def render_error(errors, status: :unprocessable_entity)
    render json: { errors: Array(errors) }, status: status
  end
end
