import { Migration } from '@mikro-orm/migrations';

export class Migration20260331002919 extends Migration {

  override up(): void | Promise<void> {
    this.addSql(`create index "users_captor_id_index" on "users" ("captor_id");`);
  }

  override down(): void | Promise<void> {
    this.addSql(`drop index "users_captor_id_index";`);
  }

}
