class API::V1::EventsController < ApplicationController
  include Authenticable
  respond_to :json
 
  before_action :set_event, only: [:show, :update, :destroy, :attend_event]
  before_action :verify_jwt_token, only: [:create, :update, :destroy, :attend_event]

  def index
    events = Event.all
    render_success({ events: events })
  end

  def show
    event_json = @event.as_json
    event_json[:image_url] = url_for(@event.image) if @event.image.attached?
    render_success({ event: event_json })
  end

  def create
    @event = Event.new(event_params.except(:image_base64))
    @event.user = current_user
    handle_image_attachment if event_params[:image_base64]

    if @event.save
      Rails.logger.info("Event created successfully: #{@event.name}")
      render_success({ event: @event, message: 'Event created successfully.' }, status: :created)
    else
      Rails.logger.error("Event creation failed: #{@event.errors.full_messages.join(', ')}")
      render_error(@event.errors.full_messages)
    end
  end

  def update
    handle_image_attachment if event_params[:image_base64]

    if @event.update(event_params.except(:image_base64))
      Rails.logger.info("Event updated successfully: #{@event.name}")
      render_success({ event: @event, message: 'Event updated successfully.' })
    else
      Rails.logger.error("Event update failed: #{@event.errors.full_messages.join(', ')}")
      render_error(@event.errors.full_messages)
    end
  end

  def destroy
    if @event.destroy
      Rails.logger.info("Event deleted successfully: #{@event.name}")
      render_success({ message: 'Event successfully deleted.' })
    else
      Rails.logger.error("Event deletion failed: #{@event.errors.full_messages.join(', ')}")
      render_error(@event.errors.full_messages)
    end
  end

  def attend_event
    attendance = Attendance.new(user: current_user, event: @event)

    if attendance.save
      Rails.logger.info("Attendance confirmed for event: #{@event.name}, user: #{current_user.email}")
      render_success({ message: 'You have confirmed your attendance.' })
    else
      Rails.logger.error("Attendance confirmation failed: #{attendance.errors.full_messages.join(', ')}")
      render_error(attendance.errors.full_messages)
    end
  end

  private

  def set_event
    @event = Event.find_by(id: params[:id])
    unless @event
      Rails.logger.warn("Event not found with id: #{params[:id]}")
      render_error('Event not found', status: :not_found)
    end
  end

  def event_params
    params.require(:event).permit(:name, :description, :date, :location, :image_base64)
  end

  def handle_image_attachment
    begin
      decoded_image = decode_image(event_params[:image_base64])
      @event.image.attach(io: decoded_image[:io], filename: decoded_image[:filename], content_type: decoded_image[:content_type])
      Rails.logger.info("Image attached successfully for event: #{@event.name}")
    rescue => e
      Rails.logger.error("Image upload failed: #{e.message}")
      render_error('Image upload failed')
    end
  end

  def decode_image(image_base64)
    Rails.logger.info("Decoding image...")
    content_type = image_base64[%r{data:(.*?);base64}, 1]
    encoded_image = image_base64.split(',')[1]
    decoded_image = Base64.decode64(encoded_image)

    io = StringIO.new(decoded_image)
    filename = "event_image_#{SecureRandom.uuid}.#{content_type.split('/').last}"

    { io: io, filename: filename, content_type: content_type }
  rescue => e
    Rails.logger.error("Error decoding image: #{e.message}")
    raise "Invalid image format"
  end

  def verify_jwt_token
    authenticate_user!
    unless current_user
      Rails.logger.warn("Unauthorized access attempt")
      head :unauthorized
    end
  end

  def render_success(data, status: :ok)
    render json: data, status: status
  end

  def render_error(errors, status: :unprocessable_entity)
    render json: { errors: Array(errors) }, status: status
  end
end
