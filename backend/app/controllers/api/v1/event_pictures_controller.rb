class API::V1::EventPicturesController < ApplicationController
  include Authenticable
  before_action :set_event
  before_action :verify_jwt_token, only: [:create, :destroy]

  def index
    @event_pictures = @event.event_pictures.includes(:user)

    json_response = @event_pictures.map do |event_picture|
      event_picture.as_json.merge(
        image_url: url_for(event_picture.picture),
        user: {
          id: event_picture.user.id,
          handle: event_picture.user.handle
        }
      )
    end

    render_success({ event_pictures: json_response })
  end

  def create
    @event_picture = @event.event_pictures.new(event_picture_params)
    @event_picture.user_id = current_user.id

    if @event_picture.save
      render_success({ message: 'Image successfully uploaded.', event_picture: @event_picture }, status: :created)
    else
      render_error(@event_picture.errors.full_messages)
    end
  end

  def destroy
    @event_picture = @event.event_pictures.find(params[:id])
    if @event_picture.destroy
      render_success({ message: 'Image successfully deleted.' }, status: :no_content)
    else
      render_error(@event_picture.errors.full_messages)
    end
  end

  private

  def set_event
    @event = Event.find_by(id: params[:event_id])
    render_error('Event not found', status: :not_found) unless @event
  end

  def event_picture_params
    params.require(:event_picture).permit(:description, :picture, :tagged_friends)
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
