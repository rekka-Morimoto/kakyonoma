import { NextResponse } from 'next/server';

const messages = {
  ja: `Made by: 烈火モリモト (@ebifry_no_sippo)

Illustration: えびフレア (@ErfunGumiful)

Background Design: びぐあいらん (@bigIsland_paint)

-------------------------------------------------------------

お問い合わせ先: 烈火モリモト`,

  zh: `网站制作: 烈火Morimoto (@ebifry_no_sippo)

插画绘制: えびフレア (@ErfunGumiful)

背景设计: びぐあいらん (@bigIsland_paint)

-------------------------------------------------------------

联系与询问: 烈火Morimoto`,

  en: `Site Creator: Rekka Morimoto (@ebifry_no_sippo)

Illustration: Ebi Flare (@ErfunGumiful)

Background Design: BigIsland (@bigIsland_paint)

-------------------------------------------------------------

Contact & Inquiries: Rekka Morimoto`
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lang = searchParams.get('lang') as 'ja' | 'zh' | 'en';
  
  if (lang && messages[lang]) {
    return NextResponse.json({ content: messages[lang] });
  }

  return NextResponse.json({ content: messages.ja, messages });
}
