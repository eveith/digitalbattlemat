# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20140326223806) do

  create_table "items", force: true do |t|
    t.string  "name"
    t.text    "description"
    t.integer "ruleset"
    t.integer "item_type"
    t.float   "value"
    t.text    "hook"
  end

  add_index "items", ["item_type"], name: "index_items_on_item_type"
  add_index "items", ["name"], name: "index_items_on_name"
  add_index "items", ["ruleset"], name: "index_items_on_ruleset"

  create_table "items_relations", force: true do |t|
    t.integer "parent_id"
    t.integer "child_id"
  end

  add_index "items_relations", ["child_id"], name: "index_items_relations_on_child_id"
  add_index "items_relations", ["parent_id"], name: "index_items_relations_on_parent_id"

  create_table "mats", force: true do |t|
    t.string   "unique_hash"
    t.integer  "user_id"
    t.string   "title"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "mats", ["unique_hash"], name: "index_mats_on_unique_hash", unique: true
  add_index "mats", ["user_id"], name: "index_mats_on_user_id", unique: true

end
