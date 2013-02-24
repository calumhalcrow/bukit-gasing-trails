class AddIconToPositions < ActiveRecord::Migration
  def change
    add_column :positions, :icon, :string
    remove_column :positions, :has_icon, :boolean
  end
end
