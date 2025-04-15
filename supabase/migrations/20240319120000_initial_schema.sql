-- Migration: Initial schema for TripPlanner MVP
-- Description: Creates users, profiles, plans, and notes tables with RLS policies
-- Author: AI Assistant
-- Date: 2024-03-19

-- Enable RLS and UUID extension
create extension if not exists "uuid-ossp";

-- Create users table
create table users (
    id uuid primary key default uuid_generate_v4(),
    email varchar(255) not null unique,
    hashed_password varchar(255) not null,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- Enable RLS on users
alter table users enable row level security;

-- RLS Policies for users
create policy "Users can view their own data" on users
    for select using (auth.uid() = id);

create policy "Users can update their own data" on users
    for update using (auth.uid() = id);

-- Create profiles table
create table profiles (
    user_id uuid primary key references users(id) on delete cascade,
    travel_type varchar(100),
    travel_style varchar(100),
    meal_preference varchar(100)
);

-- Enable RLS on profiles
alter table profiles enable row level security;

-- RLS Policies for profiles
create policy "Profiles are viewable by owner" on profiles
    for select using (auth.uid() = user_id);

create policy "Profiles are updatable by owner" on profiles
    for update using (auth.uid() = user_id);

create policy "Users can insert their own profile" on profiles
    for insert with check (auth.uid() = user_id);

-- Create plans table
create table plans (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid not null references users(id) on delete cascade,
    start_country varchar(100),
    start_city varchar(100),
    max_distance integer,
    plan varchar(10000),
    created_at timestamptz not null default now(),
    unique(user_id)
);

-- Enable RLS on plans
alter table plans enable row level security;

-- RLS Policies for plans
create policy "Plans are viewable by owner" on plans
    for select using (auth.uid() = user_id);

create policy "Plans are updatable by owner" on plans
    for update using (auth.uid() = user_id);

create policy "Users can insert their own plans" on plans
    for insert with check (auth.uid() = user_id);

create policy "Users can delete their own plans" on plans
    for delete using (auth.uid() = user_id);

-- Create notes table
create table notes (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid not null references users(id) on delete cascade,
    note_text varchar(1000) not null,
    note_summary varchar(100) not null,
    plan_id uuid references plans(id) on delete set null,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- Enable RLS on notes
alter table notes enable row level security;

-- RLS Policies for notes
create policy "Notes are viewable by owner" on notes
    for select using (auth.uid() = user_id);

create policy "Notes are updatable by owner" on notes
    for update using (auth.uid() = user_id);

create policy "Users can insert their own notes" on notes
    for insert with check (auth.uid() = user_id);

create policy "Users can delete their own notes" on notes
    for delete using (auth.uid() = user_id);

-- Create indexes
create index notes_user_id_idx on notes(user_id);
create index notes_plan_id_idx on notes(plan_id);

-- Create trigger for updating timestamps
create or replace function update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

create trigger update_users_updated_at
    before update on users
    for each row
    execute function update_updated_at_column();

create trigger update_notes_updated_at
    before update on notes
    for each row
    execute function update_updated_at_column(); 
