class API::V1::AttendancesController < ApplicationController
  def create
    existing_attendance = Attendance.find_by(user_id: attendance_params[:user_id], event_id: attendance_params[:event_id])

    if existing_attendance
      render json: { status: 'already_checked_in', message: 'Ya estás inscrito en este evento.' }, status: :ok
    else
      attendance = Attendance.new(attendance_params)
      if attendance.save
        notify_friends(attendance.user, attendance.event)
        render json: { status: 'success', attendance: attendance }, status: :created
      else
        render json: { status: 'error', errors: attendance.errors.full_messages }, status: :unprocessable_entity
      end
    end
  end

  private

  def attendance_params
    params.require(:attendance).permit(:user_id, :event_id)
  end
end
def notify_friends(user, event)
  user.friends.each do |friend|
    notification_sent = false

    if friend.expo_push_token.present?
      notification_sent = PushNotificationService.send_notification(
        to: friend.expo_push_token,
        title: "#{user.handle} participará en un evento",
        body: "¡Participa en el evento '#{event.name}'!",
        data: { screen: "EventsShow", event_id: event.id }
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
