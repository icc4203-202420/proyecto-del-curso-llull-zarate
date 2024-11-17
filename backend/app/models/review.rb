class Review < ApplicationRecord
  belongs_to :user
  belongs_to :beer

  after_save :update_beer_rating
  after_destroy :update_beer_rating
  #after_create_commit :broadcast_to_feed


  private

  def update_beer_rating
    beer.update_avg_rating
  end
  #def broadcast_to_feed
    #user.friends.each do |friend|
    #ActionCable.server.broadcast(
      #"feed_#{user.id}",
      #{
        #id: id,
        #type: 'review',
        #user: user.handle,
        #content: "New review for #{beer.name}: #{content}",
        #beerId: beer.id,
        #createdAt: created_at
      #}
    #)
  #end
  #end


end