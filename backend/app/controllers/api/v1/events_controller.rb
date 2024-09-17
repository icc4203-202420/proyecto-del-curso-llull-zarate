class API::V1::EventsController < ApplicationController
  respond_to :json
  before_action :set_event, only: [:show, :update, :destroy, :attend_event]
  before_action :verify_jwt_token, only: [:create, :update, :destroy, :attend_event]

  def index
    events = Event.all
    render json: { events: events }, status: :ok
  end

  def show
    if @event.image.attached?
      render json: @event.as_json.merge({ 
        image_url: url_for(@event.image), 
        thumbnail_url: url_for(@event.thumbnail) }),
        status: :ok
    else
      render json: { event: @event.as_json }, status: :ok
    end
  end

  def create
    @event = Event.new(event_params.except(:image_base64))
    @event.user = current_user 
    handle_image_attachment if event_params[:image_base64]

    if @event.save
      render json: { event: @event, message: 'Event created successfully.' }, status: :created
    else
      render json: @event.errors, status: :unprocessable_entity
    end
  end

  def update
    handle_image_attachment if event_params[:image_base64]

    if @event.update(event_params.except(:image_base64))
      render json: { event: @event, message: 'Event updated successfully.' }, status: :ok
    else
      render json: @event.errors, status: :unprocessable_entity
    end
  end

  def destroy
    if @event.destroy
      render json: { message: 'Event successfully deleted.' }, status: :no_content
    else
      render json: @event.errors, status: :unprocessable_entity
    end
  end

  def attend_event
    attendance = Attendance.new(user: current_user, event: @event)

    if attendance.save
      render json: { message: 'You have confirmed your attendance.' }, status: :ok
    else
      render json: attendance.errors, status: :unprocessable_entity
    end
  end

  private

  def set_event
    @event = Event.find_by(id: params[:id])
    render json: { error: 'Event not found' }, status: :not_found if @event.nil?
  end

  def event_params
    params.require(:event).permit(:name, :description, :date, :location, :image_base64)
  end

  def handle_image_attachment
    decoded_image = decode_image(event_params[:image_base64])
    @event.image.attach(io: decoded_image[:io], filename: decoded_image[:filename], content_type: decoded_image[:content_type])
  end

  def verify_jwt_token
    authenticate_user!
    head :unauthorized unless current_user
  end
end
