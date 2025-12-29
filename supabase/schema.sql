create table collections (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  parent_id uuid references collections(id) on delete set null,
  icon text,
  created_at timestamp with time zone default now()
);

create table items (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  collection_id uuid references collections(id) on delete set null,

  type text not null,
  title text not null,
  short_title text,
  abstract text,
  notes text,

  creators jsonb default '[]'::jsonb,

  date date,
  access_date date,

  metadata jsonb default '{}'::jsonb,

  bibliography jsonb default '[]'::jsonb,

  status text check (status in ('unread', 'reading', 'finished', 'archived')) default 'unread',
  is_favorite boolean default false,
  cover_image text,
  pdf_path text,

  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

create table tags (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  color text default 'slate',
  created_at timestamp with time zone default now()
);

create table item_tags (
  item_id uuid references items(id) on delete cascade,
  tag_id uuid references tags(id) on delete cascade,
  primary key (item_id, tag_id)
);

create index items_user_id_idx on items(user_id);
create index items_type_idx on items(type);
create index items_status_idx on items(status);
create index items_metadata_gin_idx on items using gin (metadata);
create index items_creators_gin_idx on items using gin (creators);

alter table items enable row level security;
alter table collections enable row level security;
alter table tags enable row level security;
alter table item_tags enable row level security;
alter table tags add constraint tags_name_user_id_key unique (name, user_id);
alter table item_tags add constraint item_tags_item_id_tag_id_key unique (item_id, tag_id);

create policy "Users manage their own items" on items for all using (auth.uid() = user_id);
create policy "Users manage their own collections" on collections for all using (auth.uid() = user_id);
create policy "Users manage their own tags" on tags for all using (auth.uid() = user_id);
create policy "Users manage their own item_tags" on item_tags for all
  using ( exists (select 1 from items where id = item_id and user_id = auth.uid()) );

create or replace function public.handle_new_user()
  returns trigger
  language plpgsql
  security definer set search_path = public
  as $$
  begin
    insert into public.tags (user_id, name, color)
    values
      (new.id, 'Importante', 'red'),
      (new.id, 'Revisar', 'amber'),
      (new.id, 'Teoria', 'blue'),
      (new.id, 'Metodologia', 'green');
    return new;
  end;
  $$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();






-- Políticas de segurança para o bucket 'papers' --

-- Permitir upload apenas para usuários autenticados
create policy "Usuários podem fazer upload de seus próprios papers"
on storage.objects for insert
to authenticated
with check ( bucket_id = 'papers' and auth.uid()::text = (storage.foldername(name))[1] );

-- Permitir leitura apenas para o dono
create policy "Usuários podem ver seus próprios papers"
on storage.objects for select
to authenticated
using ( bucket_id = 'papers' and auth.uid()::text = (storage.foldername(name))[1] );

-- Permitir deletar
create policy "Usuários podem deletar seus próprios papers"
on storage.objects for delete
to authenticated
using ( bucket_id = 'papers' and auth.uid()::text = (storage.foldername(name))[1] );