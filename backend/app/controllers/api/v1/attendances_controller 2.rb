class API::V1::AttendancesController < ApplicationController
  before_action :authenticate_user!  
  before_action :set_event, only: [:create]  

  def create
    attendance = Attendance.new(attendance_params.merge(user: current_user, event: @event))
  
    if attendance.save
      render json: { status: 'success', attendance: attendance }, status: :created
    else
      render json: { status: 'error', errors: attendance.errors.full_messages }, status: :unprocessable_entity
    end
  end
  

  private

  def set_event
    @event = Event.find_by(id: params[:attendance][:event_id])
    unless @event
      render json: { status: 'error', message: 'Event not found' }, status: :not_found
    end
  end

  def attendance_params
    params.require(:attendance).permit(:event_id)
  end
end
