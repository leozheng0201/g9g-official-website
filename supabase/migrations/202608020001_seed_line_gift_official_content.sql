insert into public.content_items (
  id, content_type, article_subtype, title, slug, excerpt, blocks, type_fields,
  seo_title, seo_description, canonical_url, status, sort_order, published_at, version
) values (
  '30000000-0000-4000-8000-000000000201',
  'article',
  'line_gift_academy',
  '認識 LINE 禮物：品牌進入送禮市場前，應該先看懂什麼？',
  'about-line-gift',
  '從官方市場資料、用戶輪廓、送禮場景與平台成長方向，整理品牌評估 LINE 禮物時需要理解的基礎。',
  jsonb_build_array(
    jsonb_build_object('id','33333333-3333-4333-8333-000000000001','type','paragraph','text','一般電商主要解決「我需要什麼」；送禮電商還需要回答「我想對誰表達什麼」。','enabled',true),
    jsonb_build_object('id','33333333-3333-4333-8333-000000000002','type','heading','level',2,'text','官方市場數據','enabled',true),
    jsonb_build_object('id','33333333-3333-4333-8333-000000000003','type','list','style','bullet','items',jsonb_build_array('900 萬以上 LINE 禮物用戶','2021–2025 累積送出 8,000 萬份以上禮物','20–44 歲用戶占比超過八成','34 歲以下族群超過 55%','女性約 60%、男性約 40%'),'enabled',true),
    jsonb_build_object('id','33333333-3333-4333-8333-000000000004','type','heading','level',2,'text','四大社交送禮場景','enabled',true),
    jsonb_build_object('id','33333333-3333-4333-8333-000000000005','type','list','style','numbered','items',jsonb_build_array('儀式禮物','商務禮物','吉時禮物','情緒禮物'),'enabled',true),
    jsonb_build_object('id','33333333-3333-4333-8333-000000000006','type','heading','level',2,'text','商品 × 流量 × 轉換','enabled',true),
    jsonb_build_object('id','33333333-3333-4333-8333-000000000007','type','paragraph','text','商品建立送禮理由；流量安排被看見的節奏；轉換把送禮價值說清楚。','enabled',true),
    jsonb_build_object('id','33333333-3333-4333-8333-000000000008','type','heading','level',2,'text','2026 平台方向','enabled',true),
    jsonb_build_object('id','33333333-3333-4333-8333-000000000009','type','list','style','bullet','items',jsonb_build_array('更好逛','更心動','更好送'),'enabled',true),
    jsonb_build_object('id','33333333-3333-4333-8333-000000000010','type','paragraph','text','資料來源：《2026 LINE 禮物資訊分享》。G9G／盛澄策略顧問非 LINE 官方或官方代理商；本頁將官方資料、營運解讀與 G9G 服務分開呈現。','enabled',true)
  ),
  jsonb_build_object(
    'source_title','2026 LINE 禮物資訊分享',
    'public_path','/about-line-gift',
    'featured_stats',jsonb_build_array(
      jsonb_build_object('id','users','value','900 萬以上','label','LINE 禮物用戶'),
      jsonb_build_object('id','gifts','value','8,000 萬以上','label','2021–2025 累積送禮份數'),
      jsonb_build_object('id','age-20-44','value','超過八成','label','20–44 歲用戶占比'),
      jsonb_build_object('id','scenes','value','四大場景','label','儀式、商務、吉時、情緒')
    ),
    'stats',jsonb_build_array(
      jsonb_build_object('id','users','value','900 萬以上','label','LINE 禮物用戶'),
      jsonb_build_object('id','gifts','value','8,000 萬以上','label','2021–2025 累積送禮份數'),
      jsonb_build_object('id','age-20-44','value','超過八成','label','20–44 歲用戶占比'),
      jsonb_build_object('id','under-34','value','超過 55%','label','34 歲以下族群'),
      jsonb_build_object('id','gender','value','女性約 60%／男性約 40%','label','用戶性別比例')
    ),
    'scenes',jsonb_build_array('儀式禮物','商務禮物','吉時禮物','情緒禮物'),
    'growth_formula',jsonb_build_array('商品','流量','轉換'),
    'platform_directions',jsonb_build_array('更好逛','更心動','更好送'),
    'disclaimer','資料來源：《2026 LINE 禮物資訊分享》。G9G／盛澄策略顧問非 LINE 官方或官方代理商；本頁將官方資料、營運解讀與 G9G 服務分開呈現。'
  ),
  '認識 LINE 禮物｜市場、用戶與送禮場景',
  '整理 LINE 禮物官方市場資料、用戶輪廓、四大送禮場景與品牌經營重點。',
  '/about-line-gift',
  'published',
  5,
  now(),
  1
)
on conflict (id) do nothing;

insert into public.content_revisions (content_item_id, revision_number, snapshot)
select ci.id, 1, to_jsonb(ci.*)
from public.content_items ci
where ci.id = '30000000-0000-4000-8000-000000000201'
on conflict (content_item_id, revision_number) do nothing;

insert into public.content_publications (content_item_id, revision_id, snapshot, published_at)
select cr.content_item_id, cr.id, cr.snapshot, now()
from public.content_revisions cr
where cr.content_item_id = '30000000-0000-4000-8000-000000000201'
  and cr.revision_number = 1
  and not exists (
    select 1
    from public.content_publications cp
    where cp.content_item_id = cr.content_item_id
      and cp.unpublished_at is null
  );
