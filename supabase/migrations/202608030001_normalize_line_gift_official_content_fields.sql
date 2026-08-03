do $$
declare
  fields jsonb;
  normalized jsonb;
  normalized_snapshot jsonb;
  normalized_revision_number integer;
  current_status text;
  current_published_at timestamptz;
  migration_at timestamptz := now();
begin
  select type_fields, status, published_at
  into fields, current_status, current_published_at
  from public.content_items
  where id = '30000000-0000-4000-8000-000000000201';

  if fields is null then
    return;
  end if;

  normalized := (
    fields
    - 'source_title'
    - 'public_path'
    - 'featured_stats'
    - 'growth_formula'
    - 'platform_directions'
  ) || jsonb_build_object(
    'subtype', coalesce(fields -> 'subtype', to_jsonb('line_gift_academy'::text)),
    'readingMinutes', coalesce(fields -> 'readingMinutes', to_jsonb(6)),
    'sourceTitle', coalesce(fields -> 'sourceTitle', fields -> 'source_title'),
    'publicPath', coalesce(fields -> 'publicPath', fields -> 'public_path'),
    'featuredStats', coalesce(fields -> 'featuredStats', fields -> 'featured_stats'),
    'stats', fields -> 'stats',
    'scenes', fields -> 'scenes',
    'sceneInterpretations', jsonb_build_array(
      '對應生日、週年、節慶等明確時刻，商品需要能快速說明送禮理由與儀式感。',
      '企業往來、客戶致意與團隊關係更重視穩定供貨、品牌識別與收禮體驗。',
      '開工、升遷、喬遷與祝賀等時刻，文案、寓意與包裝必須讓祝福一眼可懂。',
      '道謝、打氣、道歉與陪伴不是固定檔期，商品需要承接情緒與關係表達。'
    ),
    'growthFormula', coalesce(fields -> 'growthFormula', fields -> 'growth_formula'),
    'growthInterpretations', jsonb_build_array(
      jsonb_build_object('title', '商品', 'text', '送禮理由、對象、價格帶、組合、包裝與賀卡。'),
      jsonb_build_object('title', '流量', 'text', '平台活動、年度檔期、主題策展、品牌週與站內版位。'),
      jsonb_build_object('title', '轉換', 'text', '首圖、標題、商品頁、優惠、加價購與收禮選擇。')
    ),
    'platformDirections', coalesce(fields -> 'platformDirections', fields -> 'platform_directions'),
    'platformDirectionInterpretations', jsonb_build_array(
      '整理商品分類、價格帶與送禮對象，讓送禮者更快找到合適選項。',
      '用首圖、文案、包裝與組合說清楚商品值得被送出的理由。',
      '檢查收禮流程、配送資訊與可選項目，降低送出前後的不確定感。'
    ),
    'disclaimer', fields -> 'disclaimer'
  );

  update public.content_items
  set
    type_fields = normalized,
    version = version + 1,
    updated_at = migration_at
  where id = '30000000-0000-4000-8000-000000000201';

  select to_jsonb(ci)
  into normalized_snapshot
  from public.content_items ci
  where ci.id = '30000000-0000-4000-8000-000000000201';

  select coalesce(max(revision_number), 0) + 1
  into normalized_revision_number
  from public.content_revisions
  where content_item_id = '30000000-0000-4000-8000-000000000201';

  insert into public.content_revisions (id, content_item_id, revision_number, snapshot, created_at)
  values (
    '40000000-0000-4000-8000-000000000202',
    '30000000-0000-4000-8000-000000000201',
    normalized_revision_number,
    normalized_snapshot,
    migration_at
  );

  if current_status = 'published' then
    update public.content_publications
    set unpublished_at = migration_at
    where content_item_id = '30000000-0000-4000-8000-000000000201'
      and unpublished_at is null;

    insert into public.content_publications (
      id, content_item_id, revision_id, snapshot, published_at
    ) values (
      '50000000-0000-4000-8000-000000000202',
      '30000000-0000-4000-8000-000000000201',
      '40000000-0000-4000-8000-000000000202',
      normalized_snapshot,
      coalesce(current_published_at, migration_at)
    );
  end if;

  insert into public.content_workflow_events (
    id, content_item_id, event_type, from_status, to_status, metadata, created_at
  ) values (
    '60000000-0000-4000-8000-000000000202',
    '30000000-0000-4000-8000-000000000201',
    'official_fields_normalized',
    current_status,
    current_status,
    jsonb_build_object('migration', '202608030001_normalize_line_gift_official_content_fields'),
    migration_at
  );
end
$$;
