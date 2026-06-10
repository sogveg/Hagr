-- INSERT policies missing from initial migration
-- Run this after 001_initial.sql

create policy "Authenticated users can insert companies" on companies
  for insert with check (auth.uid() is not null);

create policy "Users can insert own company access" on company_access
  for insert with check (auth.uid() = user_id);

create policy "Company members can update companies" on companies
  for update using (
    exists (
      select 1 from company_access
      where company_access.company_id = companies.id
        and company_access.user_id = auth.uid()
    )
  );

create policy "Company members can insert people" on company_people
  for insert with check (
    exists (
      select 1 from company_access
      where company_access.company_id = company_people.company_id
        and company_access.user_id = auth.uid()
    )
  );

create policy "Company members can insert board meetings" on board_meetings
  for insert with check (
    exists (
      select 1 from company_access
      where company_access.company_id = board_meetings.company_id
        and company_access.user_id = auth.uid()
    )
  );

create policy "Company members can insert agenda items" on agenda_items
  for insert with check (
    exists (
      select 1 from board_meetings bm
      join company_access ca on ca.company_id = bm.company_id
      where bm.id = agenda_items.board_meeting_id
        and ca.user_id = auth.uid()
    )
  );

create policy "Company members can insert decisions" on decisions
  for insert with check (
    exists (
      select 1 from board_meetings bm
      join company_access ca on ca.company_id = bm.company_id
      where bm.id = decisions.board_meeting_id
        and ca.user_id = auth.uid()
    )
  );

create policy "Company members can insert strategy gatherings" on strategy_gatherings
  for insert with check (
    exists (
      select 1 from company_access
      where company_access.company_id = strategy_gatherings.company_id
        and company_access.user_id = auth.uid()
    )
  );

create policy "Company members can insert program blocks" on program_blocks
  for insert with check (
    exists (
      select 1 from strategy_gatherings sg
      join company_access ca on ca.company_id = sg.company_id
      where sg.id = program_blocks.strategy_gathering_id
        and ca.user_id = auth.uid()
    )
  );

create policy "Company members can insert event participants" on event_participants
  for insert with check (auth.uid() is not null);

create policy "Company members can insert gifts" on gifts
  for insert with check (
    exists (
      select 1 from company_access
      where company_access.company_id = gifts.company_id
        and company_access.user_id = auth.uid()
    )
  );

create policy "Company members can insert risk assessments" on risk_assessments
  for insert with check (
    exists (
      select 1 from company_access
      where company_access.company_id = risk_assessments.company_id
        and company_access.user_id = auth.uid()
    )
  );

create policy "Users can insert own subscription" on subscriptions
  for insert with check (auth.uid() = user_id);
