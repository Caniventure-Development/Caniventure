import { Migration } from '@mikro-orm/migrations';

export class Migration20260330200918 extends Migration {

  override up(): void | Promise<void> {
    this.addSql(`create type "character_role" as enum ('pred', 'prey', 'switch');`);
    this.addSql(`alter table "user_characters" drop constraint "user_characters_role_check";`);
    this.addSql(`alter table "user_characters" alter column "role" type "character_role" using ("role"::"character_role");`);

    this.addSql(`create type "cost_type" as enum ('bones', 'money');`);
    this.addSql(`alter table "shop_item_costs" drop constraint "shop_item_costs_type_check";`);
    this.addSql(`alter table "shop_item_costs" alter column "type" type "cost_type" using ("type"::"cost_type");`);
  }

  override down(): void | Promise<void> {
    this.addSql(`alter table "user_characters" alter column "role" type text using ("role"::text);`);
    this.addSql(`alter table "user_characters" add constraint "user_characters_role_check" check ("role" in ('pred', 'prey', 'switch'));`);

    this.addSql(`drop type "character_role";`);

    this.addSql(`alter table "shop_item_costs" alter column "type" type text using ("type"::text);`);
    this.addSql(`alter table "shop_item_costs" add constraint "shop_item_costs_type_check" check ("type" in ('bones', 'money'));`);

    this.addSql(`drop type "cost_type";`);
  }

}
