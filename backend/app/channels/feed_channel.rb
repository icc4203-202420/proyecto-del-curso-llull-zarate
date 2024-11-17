class FeedChannel < ApplicationCable::Channel
  def subscribed
    reject unless current_user
    stream_from "feed_#{current_user.id}"

    # stream_from "some_channel"
  end

  def unsubscribed
    
    # Any cleanup needed when channel is unsubscribed
  end
end
