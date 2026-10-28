import pg from 'pg';
const { Client } = pg;
const c = new Client({connectionString:'postgresql://neondb_owner:npg_iDL9f6QFNaOJ@ep-red-bread-za4sgjj2-pooler.c-2.eu-west-2.aws.neon.tech/Welcome?sslmode=require&channel_binding=require'});
c.connect().then(async()=>{
  console.log('connected');
  await c.query("INSERT INTO self_check_submissions (first_name,email,marketing_consent) VALUES ('Test','test@example.com',true) ON CONFLICT (email) DO NOTHING");
  const r = await c.query('SELECT count(*) FROM self_check_submissions');
  console.log(r.rows[0]);
  await c.end();
}).catch(e=>{console.log('ERR');console.log(e.message);});
