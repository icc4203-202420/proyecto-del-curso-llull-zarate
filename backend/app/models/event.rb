class Event < ApplicationRecord
  belongs_to :bar
  has_many :attendances
  has_many :users, through: :attendances
  has_many :event_pictures, dependent: :destroy

  has_one_attached :flyer
  has_one_attached :image

#after_create_commit :broadcast_to_feed

  def thumbnail
    flyer.variant(resize_to_limit: [200, nil]).processed
  end

  private

  #def broadcast_to_feed
    # Transmitir a los amigos de los usuarios asociados al evento
    #users.each do |user|
      #user.friends.each do |friend|
        #ActionCable.server.broadcast(
          #"feed_#{friend.id}",
          #{
            #id: id,
            #type: 'event',
            #user: user.handle,
            #content: "New event at #{bar.name}: #{name}",
            #eventId: id,
            #createdAt: created_at
          #}
        #)
      #end
    #end
  #end
end
