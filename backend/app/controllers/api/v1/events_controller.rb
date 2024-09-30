class API::V1::EventsController < ApplicationController
  respond_to :json
  before_action :set_event, only: [:show, :update, :destroy, :attend_event]
  before_action :verify_jwt_token, only: [:create, :update, :destroy, :attend_event]


  def index
    events = Event.all
    render json: { events: events }, status: :ok
  end

  
  
  def show
    event_json = @event.as_json
    if @event.image.attached?
      event_json.merge!({
        image_url: url_for(@event.image)
      })
    end
    render json: { event: event_json }, status: :ok
  end


  
  def create
    @event = Event.new(event_params.except(:image_base64))
    @event.user = current_user
    handle_image_attachment if event_params[:image_base64]

    if @event.save
      Rails.logger.info("Event created successfully: #{@event.name}")
      render json: { event: @event, message: 'Event created successfully.' }, status: :created
    else
      Rails.logger.error("Event creation failed: #{@event.errors.full_messages.join(', ')}")
      render json: @event.errors, status: :unprocessable_entity
    end
  end

  
  def update
    handle_image_attachment if event_params[:image_base64]

    if @event.update(event_params.except(:image_base64))
      Rails.logger.info("Event updated successfully: #{@event.name}")
      render json: { event: @event, message: 'Event updated successfully.' }, status: :ok
    else
      Rails.logger.error("Event update failed: #{@event.errors.full_messages.join(', ')}")
      render json: @event.errors, status: :unprocessable_entity
    end
  end

  
  def destroy
    if @event.destroy
      Rails.logger.info("Event deleted successfully: #{@event.name}")
      render json: { message: 'Event successfully deleted.' }, status: :ok
    else
      Rails.logger.error("Event deletion failed: #{@event.errors.full_messages.join(', ')}")
      render json: @event.errors, status: :unprocessable_entity
    end
  end

  
  def attend_event
    attendance = Attendance.new(user: current_user, event: @event)

    if attendance.save
      Rails.logger.info("Attendance confirmed for event: #{@event.name}, user: #{current_user.email}")
      render json: { message: 'You have confirmed your attendance.' }, status: :ok
    else
      Rails.logger.error("Attendance confirmation failed: #{attendance.errors.full_messages.join(', ')}")
      render json: attendance.errors, status: :unprocessable_entity
    end
  end

  private

  def set_event
    @event = Event.find_by(id: params[:id])
    if @event.nil?
      Rails.logger.warn("Event not found with id: #{params[:id]}")
      render json: { error: 'Event not found' }, status: :not_found
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
      render json: { error: 'Image upload failed' }, status: :unprocessable_entity and return
    end
  end

  def decode_image(image_base64)
    # Decodifica la imagen base64, asume que el formato es correcto.
    Rails.logger.info("Decoding image...")
    begin
      
      content_type = image_base64[%r{data:(.*?);base64}, 1]
      encoded_image = image_base64.split(',')[1]
      decoded_image = Base64.decode64(encoded_image)

      # Prepara el archivo decodificado
      io = StringIO.new(decoded_image)
      filename = "event_image_#{SecureRandom.uuid}.#{content_type.split('/').last}"

      { io: io, filename: filename, content_type: content_type }
    rescue => e
      Rails.logger.error("Error decoding image: #{e.message}")
      raise "Invalid image format"
    end
  end

  def verify_jwt_token
    authenticate_user!
    unless current_user
      Rails.logger.warn("Unauthorized access attempt")
      head :unauthorized
    end
  end
end

