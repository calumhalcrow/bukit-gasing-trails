class CreateNodes < ActiveRecord::Migration
  def change
    create_table :nodes do |t|
      t.float :lat
      t.float :lon
      t.integer :osmid
      t.integer :way_id

      t.timestamps
    end
  end
end
