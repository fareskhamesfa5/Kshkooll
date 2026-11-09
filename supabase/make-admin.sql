-- بعد إنشاء حساب الأدمن من صفحة التسجيل وتأكيد البريد:
-- استبدل admin-email@example.com بالبريد الحقيقي الذي سجلت به.
-- نفّذ هذا الاستعلام من Supabase SQL Editor فقط.
update public.profiles
set username = 'admin0100725',
    role = 'admin'
where id = (
  select id from auth.users
  where email = 'admin-email@example.com'
  limit 1
);
