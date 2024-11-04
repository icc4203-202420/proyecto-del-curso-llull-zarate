class API::V1::AttendancesController < ApplicationController
  def create
    existing_attendance = Attendance.find_by(user_id: attendance_params[:user_id], event_id: attendance_params[:event_id])

    if existing_attendance
      render json: { status: 'already_checked_in', message: 'Ya estás inscrito en este evento.' }, status: :ok
    else
      attendance = Attendance.new(attendance_params)
      if attendance.save
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
