class API::V1::EventPicturesController < ApplicationController
  include Authenticable
  before_action :set_event
  before_action :verify_jwt_token, only: [:create, :destroy]

  def index
    @event_pictures = @event.event_pictures.includes(:user)

    json_response = @event_pictures.map do |event_picture|
      event_picture.as_json.merge(
        image_url: event_picture.picture.attached? ? url_for(event_picture.picture) : nil,
        user: {
          id: event_picture.user.id,
          handle: event_picture.user.handle
        },
        tagged_friends: event_picture.tagged_friends
      )
    end

    render_success({ event_pictures: json_response })
  end

  def create
    @event_picture = @event.event_pictures.new(event_picture_params)
    @event_picture.user = current_user  # Asigna el usuario autenticado como propietario de la imagen
    Rails.logger.info("Tagged friends: #{event_picture_params[:tagged_friends]}")
    if @event_picture.save
      notify_tagged_friends(@event_picture) if @event_picture.tagged_friends.present?
      render json: { message: 'Picture uploaded successfully', event_picture: @event_picture }, status: :created
    else
      render json: { errors: @event_picture.errors.full_messages }, status: :unprocessable_entity
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
    params.require(:event_picture).permit(:description, :picture, tagged_friends: [])
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

  def notify_tagged_friends(event_picture)
    friend_ids = event_picture.tagged_friends
    friends = User.where(id: friend_ids)

    friends.each do |friend|
      notification_sent = false

      if friend.expo_push_token.present?
        notification_sent = PushNotificationService.send_notification(
          to: friend.expo_push_token,
          title: "¡Has sido etiquetado en una foto!",
          body: "#{event_picture.user.handle} te ha etiquetado en una foto.",
          data: { screen: "EventImageShow", event_id: event_picture.event_id, picture_id: event_picture.id }
        )

        if notification_sent
          Rails.logger.info("Notificación enviada con éxito a #{friend.handle}")
        else
          Rails.logger.error("Error al enviar la notificación a #{friend.handle}")
        end
      else
        Rails.logger.warn("El usuario #{friend.handle} no tiene expo_push_token, no se envió notificación")
      end
    end
  end
end