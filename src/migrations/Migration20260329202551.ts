import { Migration } from '@mikro-orm/migrations';

export class Migration20260329202551 extends Migration {

  override up(): void | Promise<void> {
    this.addSql(`create table "blacklisted_ids" ("id" serial primary key, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "discord_id" varchar(255) not null, "moderator_id" varchar(255) not null, "reason" varchar(255) null);`);
    this.addSql(`alter table "blacklisted_ids" add constraint "blacklisted_ids_discord_id_unique" unique ("discord_id");`);
    this.addSql(`create index "blacklisted_ids_moderator_id_index" on "blacklisted_ids" ("moderator_id");`);
    this.addSql(`create index "blacklisted_ids_created_at_index" on "blacklisted_ids" ("created_at");`);
    this.addSql(`create index "blacklisted_ids_updated_at_index" on "blacklisted_ids" ("updated_at");`);
    this.addSql(`alter table "blacklisted_ids" add constraint "blacklisted_ids_discord_id_check" check (discord_id <> '');`);

    this.addSql(`create table "shop_item_costs" ("id" serial primary key, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "type" text not null, "amount" bigint not null);`);
    this.addSql(`create index "shop_item_costs_created_at_index" on "shop_item_costs" ("created_at");`);
    this.addSql(`create index "shop_item_costs_updated_at_index" on "shop_item_costs" ("updated_at");`);
    this.addSql(`create index "shop_item_costs_amount_index" on "shop_item_costs" ("amount");`);
    this.addSql(`alter table "shop_item_costs" add constraint "const_amount_not_zero" check (amount > 0);`);
    this.addSql(`alter table "shop_item_costs" add constraint "shop_item_costs_type_check" check ("type" in ('bones', 'money'));`);

    this.addSql(`create table "shop_items" ("id" serial primary key, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "item_id" varchar(255) not null, "name" varchar(255) not null, "description" varchar(255) not null, "cost_id" int not null);`);
    this.addSql(`alter table "shop_items" add constraint "shop_items_cost_id_unique" unique ("cost_id");`);
    this.addSql(`create index "shop_items_created_at_index" on "shop_items" ("created_at");`);
    this.addSql(`create index "shop_items_updated_at_index" on "shop_items" ("updated_at");`);
    this.addSql(`alter table "shop_items" add constraint "const_item_id_not_empty" check (item_id <> '');`);
    this.addSql(`alter table "shop_items" add constraint "const_name_not_empty" check (name <> '');`);
    this.addSql(`alter table "shop_items" add constraint "const_description_not_empty" check (description <> '');`);

    this.addSql(`create table "user_balances" ("id" serial primary key, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "bones_collected" bigint not null default 0, "bones_in_stomach" bigint not null default 0, "money" bigint not null default 0);`);
    this.addSql(`create index "user_balances_created_at_index" on "user_balances" ("created_at");`);
    this.addSql(`create index "user_balances_updated_at_index" on "user_balances" ("updated_at");`);
    this.addSql(`create index "indx_bones_collected" on "user_balances" ("bones_collected");`);
    this.addSql(`create index "indx_bones_in_stomach" on "user_balances" ("bones_in_stomach");`);
    this.addSql(`create index "indx_money" on "user_balances" ("money");`);
    this.addSql(`alter table "user_balances" add constraint "const_bones_collected_non_negative" check (bones_collected >= 0);`);
    this.addSql(`alter table "user_balances" add constraint "const_bones_in_stomach_non_negative" check (bones_in_stomach >= 0);`);
    this.addSql(`alter table "user_balances" add constraint "const_money_non_negative" check (money >= 0);`);

    this.addSql(`create table "user_bios" ("id" serial primary key, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "content" varchar(80) not null default 'A mysterious predator');`);
    this.addSql(`create index "user_bios_created_at_index" on "user_bios" ("created_at");`);
    this.addSql(`create index "user_bios_updated_at_index" on "user_bios" ("updated_at");`);

    this.addSql(`create table "user_hunting_stats" ("id" serial primary key, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "hunts_done" int not null default 0, "hunts_won" int not null default 0);`);
    this.addSql(`create index "user_hunting_stats_created_at_index" on "user_hunting_stats" ("created_at");`);
    this.addSql(`create index "user_hunting_stats_updated_at_index" on "user_hunting_stats" ("updated_at");`);
    this.addSql(`create index "user_hunting_stats_hunts_done_index" on "user_hunting_stats" ("hunts_done");`);
    this.addSql(`create index "user_hunting_stats_hunts_won_index" on "user_hunting_stats" ("hunts_won");`);
    this.addSql(`alter table "user_hunting_stats" add constraint "const_hunts_done_non_negative" check (hunts_done >= 0);`);
    this.addSql(`alter table "user_hunting_stats" add constraint "const_hunts_won_non_negative" check (hunts_won >= 0);`);

    this.addSql(`create table "user_settings" ("id" serial primary key, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "pvp_on" boolean not null default false, "permavore_mode_on" boolean not null default false, "allow_mentions" boolean not null default false);`);
    this.addSql(`create index "user_settings_created_at_index" on "user_settings" ("created_at");`);
    this.addSql(`create index "user_settings_updated_at_index" on "user_settings" ("updated_at");`);

    this.addSql(`create table "user_states" ("id" serial primary key, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "is_digesting" boolean not null default false, "is_regurgitating" boolean not null default false, "is_in_pvp" boolean not null default false);`);
    this.addSql(`create index "user_states_created_at_index" on "user_states" ("created_at");`);
    this.addSql(`create index "user_states_updated_at_index" on "user_states" ("updated_at");`);

    this.addSql(`create table "user_stomachs" ("id" serial primary key, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "capacity" bigint not null default 1, "current_size" bigint not null default 0, "opponents_inside" text[] not null default '{}', "users_inside" text[] not null default '{}', "digestion_time" numeric(10,0) not null default 180);`);
    this.addSql(`create index "user_stomachs_created_at_index" on "user_stomachs" ("created_at");`);
    this.addSql(`create index "user_stomachs_updated_at_index" on "user_stomachs" ("updated_at");`);
    this.addSql(`create index "user_stomachs_capacity_index" on "user_stomachs" ("capacity");`);
    this.addSql(`create index "user_stomachs_current_size_index" on "user_stomachs" ("current_size");`);
    this.addSql(`create index "user_stomachs_digestion_time_index" on "user_stomachs" ("digestion_time");`);
    this.addSql(`alter table "user_stomachs" add constraint "const_capacity_non_zero" check (capacity > 0);`);
    this.addSql(`alter table "user_stomachs" add constraint "const_current_size_not_full" check (current_size <= capacity);`);
    this.addSql(`alter table "user_stomachs" add constraint "const_current_size_positive" check (current_size >= 0);`);

    this.addSql(`create table "user_stomach_stats" ("id" serial primary key, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "prey_captured" int not null default 0, "prey_digested" int not null default 0);`);
    this.addSql(`create index "user_stomach_stats_created_at_index" on "user_stomach_stats" ("created_at");`);
    this.addSql(`create index "user_stomach_stats_updated_at_index" on "user_stomach_stats" ("updated_at");`);
    this.addSql(`create index "user_stomach_stats_prey_captured_index" on "user_stomach_stats" ("prey_captured");`);
    this.addSql(`create index "user_stomach_stats_prey_digested_index" on "user_stomach_stats" ("prey_digested");`);
    this.addSql(`alter table "user_stomach_stats" add constraint "const_prey_captured_non_negative" check (prey_captured >= 0);`);
    this.addSql(`alter table "user_stomach_stats" add constraint "const_prey_digested_non_negative" check (prey_digested >= 0);`);

    this.addSql(`create table "user_stats" ("id" serial primary key, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "hunting_id" int not null, "stomach_id" int not null);`);
    this.addSql(`alter table "user_stats" add constraint "user_stats_hunting_id_unique" unique ("hunting_id");`);
    this.addSql(`alter table "user_stats" add constraint "user_stats_stomach_id_unique" unique ("stomach_id");`);
    this.addSql(`create index "user_stats_created_at_index" on "user_stats" ("created_at");`);
    this.addSql(`create index "user_stats_updated_at_index" on "user_stats" ("updated_at");`);

    this.addSql(`create table "users" ("id" serial primary key, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "discord_id" varchar(255) not null, "level" int not null default 1, "experience" int not null default 0, "double_bones_active" boolean not null default false, "has_done_tutorial" boolean not null default false, "is_in_stomach" boolean not null default false, "captor_id" varchar(255) null, "balance_id" int not null, "bio_id" int not null, "settings_id" int not null, "states_id" int not null, "stats_id" int not null, "stomach_id" int not null);`);
    this.addSql(`alter table "users" add constraint "users_discord_id_unique" unique ("discord_id");`);
    this.addSql(`alter table "users" add constraint "users_balance_id_unique" unique ("balance_id");`);
    this.addSql(`alter table "users" add constraint "users_bio_id_unique" unique ("bio_id");`);
    this.addSql(`alter table "users" add constraint "users_settings_id_unique" unique ("settings_id");`);
    this.addSql(`alter table "users" add constraint "users_states_id_unique" unique ("states_id");`);
    this.addSql(`alter table "users" add constraint "users_stats_id_unique" unique ("stats_id");`);
    this.addSql(`alter table "users" add constraint "users_stomach_id_unique" unique ("stomach_id");`);
    this.addSql(`create index "users_created_at_index" on "users" ("created_at");`);
    this.addSql(`create index "users_updated_at_index" on "users" ("updated_at");`);
    this.addSql(`create index "users_level_index" on "users" ("level");`);
    this.addSql(`create index "users_experience_index" on "users" ("experience");`);
    this.addSql(`alter table "users" add constraint "blacklisted_ids_discord_id_check" check (discord_id <> '');`);
    this.addSql(`alter table "users" add constraint "const_level_valid" check (level >= 1);`);
    this.addSql(`alter table "users" add constraint "const_experience_valid" check (experience >= 0);`);

    this.addSql(`create table "user_inventory_items" ("id" serial primary key, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "holder_id" int not null, "item_id" int not null, "quantity" bigint not null default 0);`);
    this.addSql(`alter table "user_inventory_items" add constraint "user_inventory_items_item_id_unique" unique ("item_id");`);
    this.addSql(`create index "user_inventory_items_created_at_index" on "user_inventory_items" ("created_at");`);
    this.addSql(`create index "user_inventory_items_updated_at_index" on "user_inventory_items" ("updated_at");`);

    this.addSql(`create table "user_characters" ("id" serial primary key, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "owner_id" int not null, "character_id" varchar(255) not null, "name" varchar(255) not null, "species" varchar(255) not null, "role" text not null, "bio" varchar(1000) not null default 'A mysterious yet intriguing character', "height" int not null default 12, "initial_height" int not null default 12, "weight" int not null default 300, "initial_weight" int not null default 300, "is_permad" boolean not null default false, "digested_by" varchar(255) null);`);
    this.addSql(`create index "user_characters_created_at_index" on "user_characters" ("created_at");`);
    this.addSql(`create index "user_characters_updated_at_index" on "user_characters" ("updated_at");`);
    this.addSql(`alter table "user_characters" add constraint "user_characters_owner_id_character_id_unique" unique ("owner_id", "character_id");`);
    this.addSql(`alter table "user_characters" add constraint "const_id_not_empty" check (character_id <> '');`);
    this.addSql(`alter table "user_characters" add constraint "const_name_not_empty" check (name <> '');`);
    this.addSql(`alter table "user_characters" add constraint "const_weight_non_negative" check (weight >= 0);`);
    this.addSql(`alter table "user_characters" add constraint "user_characters_role_check" check ("role" in ('pred', 'prey', 'switch'));`);

    this.addSql(`alter table "shop_items" add constraint "shop_items_cost_id_foreign" foreign key ("cost_id") references "shop_item_costs" ("id");`);

    this.addSql(`alter table "user_stats" add constraint "user_stats_hunting_id_foreign" foreign key ("hunting_id") references "user_hunting_stats" ("id");`);
    this.addSql(`alter table "user_stats" add constraint "user_stats_stomach_id_foreign" foreign key ("stomach_id") references "user_stomach_stats" ("id");`);

    this.addSql(`alter table "users" add constraint "users_balance_id_foreign" foreign key ("balance_id") references "user_balances" ("id");`);
    this.addSql(`alter table "users" add constraint "users_bio_id_foreign" foreign key ("bio_id") references "user_bios" ("id");`);
    this.addSql(`alter table "users" add constraint "users_settings_id_foreign" foreign key ("settings_id") references "user_settings" ("id");`);
    this.addSql(`alter table "users" add constraint "users_states_id_foreign" foreign key ("states_id") references "user_states" ("id");`);
    this.addSql(`alter table "users" add constraint "users_stats_id_foreign" foreign key ("stats_id") references "user_stats" ("id");`);
    this.addSql(`alter table "users" add constraint "users_stomach_id_foreign" foreign key ("stomach_id") references "user_stomachs" ("id");`);

    this.addSql(`alter table "user_inventory_items" add constraint "user_inventory_items_holder_id_foreign" foreign key ("holder_id") references "users" ("id");`);
    this.addSql(`alter table "user_inventory_items" add constraint "user_inventory_items_item_id_foreign" foreign key ("item_id") references "shop_items" ("id");`);

    this.addSql(`alter table "user_characters" add constraint "user_characters_owner_id_foreign" foreign key ("owner_id") references "users" ("id");`);
  }

  override down() {
    this.dropTable('blacklisted_ids')
    this.dropTable('shop_item_costs')
    this.dropTable('shop_items')
    this.dropTable('user_balances')
    this.dropTable('user_bios')
    this.dropTable('user_characters')
    this.dropTable('user_inventory_items')
    this.dropTable('user_hunting_stats')
    this.dropTable('user_settings')
    this.dropTable('user_stomachs')
    this.dropTable('user_states')
    this.dropTable('user_stomach_stats')
    this.dropTable('user_stats')
    this.dropTable('users')
  }

  private dropTable(name: string) {
    return this.addSql(`drop table "${name}" cascade`)
  }
}
