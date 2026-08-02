insert into public.content_items (
  id, content_type, title, slug, excerpt, blocks, type_fields, seo_title, seo_description,
  status, sort_order, published_at, version
) values
(
  '30000000-0000-4000-8000-000000000001', 'case_study', '微笑甜果｜LINE 禮物電商案例', 'smile-fruit',
  '以送禮情境與主打品策略，建立節慶檔期的成長動能。',
  jsonb_build_array(
    jsonb_build_object('id','11111111-1111-4111-8111-111111111101','type','paragraph','text','以送禮情境與主打品策略，建立節慶檔期的成長動能。','enabled',true),
    jsonb_build_object('id','11111111-1111-4111-8111-111111111102','type','list','style','bullet','items',jsonb_build_array('過年重點檔期以低廣告預算創造單月近百萬業績','堅持不降價','將櫻桃水果禮盒打造為代表性主打商品'),'enabled',true)
  ),
  jsonb_build_object('brandName','微笑甜果','serviceScope',jsonb_build_array('LINE 禮物電商營運'),'resultSummary','節慶檔期成長與主打品建立。','resultAttribution','以上為微笑甜果 LINE 禮物電商營運案例成果。','migrationKey','case-smile-fruit','publicPath','/cases/smile-fruit'),
  '微笑甜果 LINE 禮物電商案例', '了解微笑甜果如何以送禮情境與主打品策略建立節慶檔期成長。',
  'published', 10, now(), 1
),
(
  '30000000-0000-4000-8000-000000000002', 'case_study', '法布甜｜整體電商與品牌轉型案例', 'ar-patisserie',
  '從傳統伴手禮市場，升級至高客單、高附加價值的送禮市場。',
  jsonb_build_array(
    jsonb_build_object('id','11111111-1111-4111-8111-111111111201','type','paragraph','text','從傳統伴手禮市場，升級至高客單、高附加價值的送禮市場。','enabled',true),
    jsonb_build_object('id','11111111-1111-4111-8111-111111111202','type','list','style','bullet','items',jsonb_build_array('整體電商年營業額突破千萬','單月 GMV 穩定達百萬','單月訂單超過 1,400 筆'),'enabled',true),
    jsonb_build_object('id','11111111-1111-4111-8111-111111111203','type','paragraph','text','以上為整體電商與品牌轉型成果，不代表 LINE 禮物單一平台成果。','enabled',true)
  ),
  jsonb_build_object('brandName','法布甜','serviceScope',jsonb_build_array('整體電商','品牌轉型'),'resultSummary','品牌定位與整體電商營運升級。','resultAttribution','以上為整體電商與品牌轉型成果，不代表 LINE 禮物單一平台成果。','migrationKey','case-ar-patisserie','publicPath','/cases/ar-patisserie'),
  '法布甜整體電商與品牌轉型案例', '了解法布甜如何從傳統伴手禮市場升級至高附加價值送禮市場。',
  'published', 20, now(), 1
),
(
  '30000000-0000-4000-8000-000000000101', 'faq', '什麼品牌適合進入 LINE 禮物？', 'fit',
  '會從穩定供貨、基本客服、送禮潛力，以及品牌是否願意建立主打商品一起判斷。',
  jsonb_build_array(jsonb_build_object('id','22222222-2222-4222-8222-000000000001','type','paragraph','text','會從穩定供貨、基本客服、送禮潛力，以及品牌是否願意建立主打商品一起判斷。','enabled',true)),
  jsonb_build_object('question','什麼品牌適合進入 LINE 禮物？','category','合作與服務','migrationKey','faq-fit','publicPath','/faq#fit'),
  '什麼品牌適合進入 LINE 禮物？｜G9G FAQ', '會從穩定供貨、基本客服、送禮潛力，以及品牌是否願意建立主打商品一起判斷。',
  'published', 10, now(), 1
),
(
  '30000000-0000-4000-8000-000000000102', 'faq', '還沒進駐 LINE 禮物，可以先合作嗎？', 'before-entry',
  '可以先做品牌成長健檢與商城啟動規劃，但 G9G 不保證平台審核結果。',
  jsonb_build_array(jsonb_build_object('id','22222222-2222-4222-8222-000000000002','type','paragraph','text','可以先做品牌成長健檢與商城啟動規劃，但 G9G 不保證平台審核結果。','enabled',true)),
  jsonb_build_object('question','還沒進駐 LINE 禮物，可以先合作嗎？','category','合作與服務','migrationKey','faq-before-entry','publicPath','/faq#before-entry'),
  '還沒進駐 LINE 禮物，可以先合作嗎？｜G9G FAQ', '可以先做品牌成長健檢與商城啟動規劃，但 G9G 不保證平台審核結果。',
  'published', 20, now(), 1
),
(
  '30000000-0000-4000-8000-000000000103', 'faq', 'G9G 會保證上架或業績嗎？', 'guarantee',
  '不會。G9G 不保證商城核准、特定業績、流量或搜尋排名。',
  jsonb_build_array(jsonb_build_object('id','22222222-2222-4222-8222-000000000003','type','paragraph','text','不會。G9G 不保證商城核准、特定業績、流量或搜尋排名。','enabled',true)),
  jsonb_build_object('question','G9G 會保證上架或業績嗎？','category','合作與服務','migrationKey','faq-guarantee','publicPath','/faq#guarantee'),
  'G9G 會保證上架或業績嗎？｜G9G FAQ', '不會。G9G 不保證商城核准、特定業績、流量或搜尋排名。',
  'published', 30, now(), 1
),
(
  '30000000-0000-4000-8000-000000000104', 'faq', '廣告與站內版位費包含在服務費嗎？', 'placements',
  '廣告預算與 LINE 禮物站內版位費另計；G9G 依合作方案提供策略、規劃與基本版位素材尺寸延伸。',
  jsonb_build_array(jsonb_build_object('id','22222222-2222-4222-8222-000000000004','type','paragraph','text','廣告預算與 LINE 禮物站內版位費另計；G9G 依合作方案提供策略、規劃與基本版位素材尺寸延伸。','enabled',true)),
  jsonb_build_object('question','廣告與站內版位費包含在服務費嗎？','category','合作與服務','migrationKey','faq-placements','publicPath','/faq#placements'),
  '廣告與站內版位費包含在服務費嗎？｜G9G FAQ', '廣告預算與 LINE 禮物站內版位費另計；G9G 依合作方案提供策略、規劃與基本版位素材尺寸延伸。',
  'published', 40, now(), 1
),
(
  '30000000-0000-4000-8000-000000000105', 'faq', '三種代營運方案有什麼差異？', 'plans',
  '商城啟動適合第一次進場；成果分潤依完成訂單成交額計算；全年代營運建立 12 個月的商品、檔期、版位與數據節奏。',
  jsonb_build_array(jsonb_build_object('id','22222222-2222-4222-8222-000000000005','type','paragraph','text','商城啟動適合第一次進場；成果分潤依完成訂單成交額計算；全年代營運建立 12 個月的商品、檔期、版位與數據節奏。','enabled',true)),
  jsonb_build_object('question','三種代營運方案有什麼差異？','category','合作與服務','migrationKey','faq-plans','publicPath','/faq#plans'),
  '三種代營運方案有什麼差異？｜G9G FAQ', '商城啟動適合第一次進場；成果分潤依完成訂單成交額計算；全年代營運建立 12 個月的商品、檔期、版位與數據節奏。',
  'published', 50, now(), 1
),
(
  '30000000-0000-4000-8000-000000000106', 'faq', '品牌成長健檢會怎麼進行？', 'audit',
  '先提交第一階段申請；初審後再由 G9G 聯繫並說明後續流程。',
  jsonb_build_array(jsonb_build_object('id','22222222-2222-4222-8222-000000000006','type','paragraph','text','先提交第一階段申請；初審後再由 G9G 聯繫並說明後續流程。','enabled',true)),
  jsonb_build_object('question','品牌成長健檢會怎麼進行？','category','合作與服務','migrationKey','faq-audit','publicPath','/faq#audit'),
  '品牌成長健檢會怎麼進行？｜G9G FAQ', '先提交第一階段申請；初審後再由 G9G 聯繫並說明後續流程。',
  'published', 60, now(), 1
)
on conflict (id) do nothing;

insert into public.content_revisions (content_item_id, revision_number, snapshot)
select ci.id, 1, to_jsonb(ci.*)
from public.content_items ci
where ci.id in (
  '30000000-0000-4000-8000-000000000001',
  '30000000-0000-4000-8000-000000000002',
  '30000000-0000-4000-8000-000000000101',
  '30000000-0000-4000-8000-000000000102',
  '30000000-0000-4000-8000-000000000103',
  '30000000-0000-4000-8000-000000000104',
  '30000000-0000-4000-8000-000000000105',
  '30000000-0000-4000-8000-000000000106'
)
on conflict (content_item_id, revision_number) do nothing;

insert into public.content_publications (content_item_id, revision_id, snapshot, published_at)
select cr.content_item_id, cr.id, cr.snapshot, now()
from public.content_revisions cr
where cr.revision_number = 1
  and cr.content_item_id in (
    '30000000-0000-4000-8000-000000000001',
    '30000000-0000-4000-8000-000000000002',
    '30000000-0000-4000-8000-000000000101',
    '30000000-0000-4000-8000-000000000102',
    '30000000-0000-4000-8000-000000000103',
    '30000000-0000-4000-8000-000000000104',
    '30000000-0000-4000-8000-000000000105',
    '30000000-0000-4000-8000-000000000106'
  )
  and not exists (
    select 1
    from public.content_publications cp
    where cp.content_item_id = cr.content_item_id
      and cp.unpublished_at is null
  );
