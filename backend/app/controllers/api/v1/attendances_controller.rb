class API::V1::AttendancesController < ApplicationController
  before_action :authenticate_user! # usuario esté autenticado

  def create
    attendance = Attendance.new(attendance_params)
    attendance.user = current_user 
    if attendance.save
      render json: { status: 'success', attendance: attendance }, status: :created
    else
      render json: { status: 'error', errors: attendance.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def attendance_params
    params.require(:attendance).permit(:event_id)
  end
end
