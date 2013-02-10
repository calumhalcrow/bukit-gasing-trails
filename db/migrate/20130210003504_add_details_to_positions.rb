class AddDetailsToPositions < ActiveRecord::Migration
  def change
    add_column :positions, :enabled, :boolean, :default => true
    add_column :positions, :has_image, :boolean, :default => false
    add_column :positions, :has_icon, :boolean, :default => false
  end
end
