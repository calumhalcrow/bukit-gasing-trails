class AddDetailsToWays < ActiveRecord::Migration
  def change
    add_column :ways, :enabled, :boolean, :default => true
    add_column :ways, :desc, :text
    add_column :ways, :osmid, :integer
  end
end
