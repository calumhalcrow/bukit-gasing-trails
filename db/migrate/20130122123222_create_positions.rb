class CreatePositions < ActiveRecord::Migration
  def change
    create_table :positions do |t|
      t.integer :way_id
      t.integer :node_id
      t.integer :order
      t.string :title
      t.string :desc

      t.timestamps
    end
  end
end
