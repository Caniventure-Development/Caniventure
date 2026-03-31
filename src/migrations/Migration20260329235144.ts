import { Migration } from '@mikro-orm/migrations';

export class Migration20260329235144 extends Migration {

  override up(): void | Promise<void> {
    this.addSql(`create index "blacklisted_ids_discord_id_index" on "blacklisted_ids" ("discord_id");`);

    this.addSql(`alter table "users" add "active_character_id" varchar(255) not null;`);
    this.addSql(`create index "users_discord_id_index" on "users" ("discord_id");`);
  }

  override down(): void | Promise<void> {
    this.addSql(`drop index "blacklisted_ids_discord_id_index";`);

    this.addSql(`drop index "users_discord_id_index";`);
    this.addSql(`alter table "users" drop column "active_character_id";`);
  }

}
