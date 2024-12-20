class EventPicture < ApplicationRecord
  belongs_to :event
  belongs_to :user
  has_one_attached :picture
  attr_accessor :tagged_friends

  after_commit :save_picture_to_public_directory, on: [:create]

  def url
    picture.attached? ? Rails.application.routes.url_helpers.rails_blob_url(picture, only_path: true) : nil
  end

  private

  def save_picture_to_public_directory
    return unless picture.attached?

    images_dir = Rails.root.join("public", "event_images", "event_#{event.id}")
    FileUtils.mkdir_p(images_dir) unless Dir.exist?(images_dir)

    unique_filename = "event_#{event.id}_#{SecureRandom.uuid}_#{picture.filename}"
    picture_path = Rails.root.join("tmp", unique_filename)

    File.open(picture_path, 'wb') do |file|
      file.write(picture.download)
    end

    FileUtils.mv(picture_path, images_dir.join(unique_filename))
  end
end
