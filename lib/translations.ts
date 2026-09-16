export type Locale = 'ja' | 'zh' | 'en';

// 人名および動的テキスト置換ルール（簡体字）
export function replaceNameForZh(text: string): string {
  if (!text) return text;

  let result = text
    .replace(/佳鏡院/g, '佳镜院')
    .replace(/メゾン・ド・きょー/g, 'Maison de 院院')
    .replace(/かきょの間/g, '院院之间')
    .replace(/かきょ年表/g, '院院年表')
    .replace(/かきょあーかいぶ/g, '院院归档')
    .replace(/まいにちかきょボイス/g, '每日院院语音')
    .replace(/おやすみかきょボイス/g, '晚安院院语音')
    .replace(/かきょみこ/g, '院院Miko')
    .replace(/きょーのお話/g, '院院的故事')
    .replace(/きょーの一曲/g, '院院的单曲')
    .replace(/きょーめいと/g, '院院めいと')
    .replace(/オリジナル曲/g, '原创单曲')
    .replace(/歌枠セトリ/g, '歌会歌单')
    .replace(/歌枠/g, '歌会')
    .replace(/ボイス/g, '语音')
    .replace(/カバー曲/g, '翻唱歌曲')
    .replace(/コラボ/g, '合作联动')
    .replace(/お話/g, '杂谈闲聊')
    .replace(/ふたりのーと。/g, '两人笔记。')
    .replace(/初配信/g, '首次直播')
    .replace(/活動開始/g, '开始活动')
    .replace(/チャンネル登録者/g, '频道订阅者')
    .replace(/万人達成/g, '万人达成')
    .replace(/新衣装披露/g, '新衣装发布')
    .replace(/3Dお披露目/g, '3D亮相直播');

  result = result.replace(/かきょ/g, '院院').replace(/きょー/g, '院院');

  return result;
}

// 人名および動的テキスト置換ルール（英語）
export function replaceNameForEn(text: string): string {
  if (!text) return text;

  let result = text
    .replace(/佳鏡院/g, 'Kakyo')
    .replace(/メゾン・ド・きょー/g, 'Maison de Kyo')
    .replace(/かきょの間/g, 'Kakyo-no-ma')
    .replace(/かきょ年表/g, 'Kakyo Timeline')
    .replace(/かきょあーかいぶ/g, 'Kakyo Archive')
    .replace(/まいにちかきょボイス/g, 'Daily Kakyo Voice')
    .replace(/おやすみかきょボイス/g, 'Goodnight Kakyo Voice')
    .replace(/かきょみこ/g, 'Kakyo & Miko')
    .replace(/きょーのお話/g, 'Kyo Talk')
    .replace(/きょーの一曲/g, 'Song of Kyo')
    .replace(/きょーめいと/g, 'Kyomate')
    .replace(/オリジナル曲/g, 'Original Song')
    .replace(/歌枠セトリ/g, 'Singing Stream Setlist')
    .replace(/歌枠/g, 'Singing Stream')
    .replace(/ボイス/g, 'Voice')
    .replace(/カバー曲/g, 'Cover Song')
    .replace(/コラボ/g, 'Collaboration')
    .replace(/お話/g, 'Talk Stream')
    .replace(/ふたりのーと。/g, 'Futari Note.')
    .replace(/初配信/g, 'Debut Stream')
    .replace(/活動開始/g, 'Activity Started')
    .replace(/チャンネル登録者/g, 'Channel Subscribers')
    .replace(/万人達成/g, '0K Subscribers Achieved')
    .replace(/新衣装披露/g, 'New Outfit Stream')
    .replace(/3Dお披露目/g, '3D Reveal Stream')
    .replace(/(\d{4})年(\d{1,2})月/g, '$1-$2');

  result = result.replace(/かきょ/g, 'Kakyo').replace(/きょー/g, 'Kyo');

  return result;
}

export const translations = {
  ja: {
    common: {
      siteTitle: 'メゾン・ド・きょー',
      back: '戻る',
      open: '開く',
      explore: '探訪する',
      listen: '聴く',
      start: 'スタート',
      checkIn: 'チェックイン',
      registry: '名簿を見る',
      message: 'メッセージ',
      langJa: '日本語',
      langZh: '简体中文',
      langEn: 'English',
      estYear: 'EST. 2026 • KAKYO-NO-MA',
    },
    nav: {
      timeline: 'かきょ年表',
      archive: 'かきょあーかいぶ',
      register: '入居届',
      registry: '住人名簿',
      kakyonoma: 'かきょの間',
      songs: 'きょーの一曲',
      diagnosis: '推しスタイル診断',
      greeting: '管理人から',
      terms: 'ご利用案内',
    },
    home: {
      welcome: 'ようこそ、この古き良き集合住宅へ。',
      subtext: 'あなたの居場所を記録し、仲間たちと過ごす時間を。',
      timelineDesc: 'これまでの活動の軌跡を年表と共に振り返る。',
      timelineOpen: '絵巻を紐解く (Open)',
      archiveDesc: 'ボイス、お話、歌枠セトリ、ふたりのーと。などの記録を振り返る。',
      archiveOpen: 'アーカイブを開く (Explore)',
      registerDesc: '自分だけのプロフィールを作成し、この場所の一員として登録します。',
      registryDesc: 'ここに住まう仲間たちの記録。いつでも誰でも閲覧できます。',
      kakyonomaDesc: '和の空気漂う憩いの場。皆の存在が畳となって広がります。',
      songsDesc: 'オリジナルやカバーの中から、今のあなたにぴったりの一曲を。',
      diagnosisDesc: '質問に答えて、あなたの推しへの向き合い方を診断します。',
      greetingDesc: '本サイトの立ち上げへの想いと、皆様へのメッセージです。',
      announcements: 'Announcements',
      officeTitle: '管理役場より',
      updated: 'Updated 2026.04',
      skipHint: 'クリックでスキップ',
    },
    terms: {
      title: 'ご利用案内',
      subtitle: 'Terms & Guidelines',
      error: '## エラー\n利用規約を読み込めませんでした。',
      agreeCheck: '内容を理解し、同意します',
      agreeButton: '同意して進む',
    },
    greeting: {
      title: 'ご挨拶',
      subtitle: 'A Message from the Manager',
      authorName: '烈火モリモト',
      authorEn: 'Rekka Morimoto',
      managerRole: 'Maison de Kyo Manager',
      error: 'ご挨拶を読み込めませんでした。',
    },
    kakyovoice: {
      title: 'かきょあーかいぶ',
      subtitle: 'Archive & Voice Collection',
      playRandom: 'ランダム再生',
      filterAll: 'すべて',
      catDailyVoice: 'まいにちかきょボイス',
      catGoodNightVoice: 'おやすみかきょボイス',
      catFutariNote: 'かきょみこ、ふたりのーと。',
      catKyoStory: '#きょーのお話',
      catOriginalSong: 'オリジナル曲',
      catCoverSong: 'カバー曲',
      catVlog: 'Vlog',
      catSetlist: '歌枠セトリ',
      noItems: '該当するアイテムがありません。',
      viewPost: '投稿を見る',
      streamLink: '配信を見る',
    },
    register: {
      title: '入居届',
      subtitle: 'Resident Registration',
      pageTitle: '入居手続き',
      instructionsTitle: '【入居手続きのご案内】',
      instructionsText: 'メゾン・ド・きょーへようこそ！下記のフォームに入力して、あなたの「部屋番号」と「名前」を登録してください。\n登録された情報は畳の間（かきょの間）や住人名簿に反映されます。',
      nameLabel: 'お名前（PN/ハンネ）',
      namePlaceholder: '例: きょーめいと太郎',
      buildingLabel: '建物（任意）',
      buildingSelect: '指定なし（標準）',
      roomLabel: '部屋番号 (1~999)',
      roomPlaceholder: '例: 101',
      iconLabel: 'アイコン画像（Twitter等）',
      iconHint: '正方形の画像が綺麗に表示されます',
      commentLabel: 'ひとことメッセージ',
      commentPlaceholder: '例: よろしくお願いします！',
      submitButton: '入居届を提出する',
      submitting: '送信中...',
      successTitle: '入居届を受理しました！',
      successText: 'あなたの入居が完了しました。かきょの間や住民名簿をご確認ください。',
      previewTitle: '転入届プレビュー',
    },
    registry: {
      title: '住人名簿',
      subtitle: 'Resident Registry',
      searchPlaceholder: '名前や部屋番号で検索...',
      buildingFilterAll: 'すべての建物',
      totalCount: '総入居者数: ',
      noResidents: '該当する住人が見つかりませんでした。',
      roomSuffix: '号室',
    },
    kakyonoma: {
      title: 'かきょの間',
      subtitle: 'Tatami Room',
      zoomIn: '拡大',
      zoomOut: '縮小',
      reset: 'リセット',
      dragHint: 'DRAG OR SWIPE TO PAN • WHEEL TO ZOOM',
      totalMats: '現在の畳数: ',
    },
    songs: {
      title: 'きょーの一曲',
      subtitle: 'Today\'s Recommended Song',
      pickupSong: '本日のピックアップソング',
      drawAgain: 'もう一度引く 🎲',
      watchOnYoutube: 'YouTubeで聴く 🎵',
      allSongs: '全楽曲リスト',
      original: 'オリジナル',
      cover: 'カバー',
      singingStream: '歌枠配信',
    },
    diagnosis: {
      title: '推しスタイル診断',
      subtitle: 'Oshi Style Diagnosis',
      startBtn: '診断をはじめる',
      restartBtn: 'もう一度診断する',
      resultTitle: 'あなたの推しスタイルは…',
      shareBtn: 'X(Twitter)でシェア',
    },
    timeline: {
      title: 'かきょ年表',
      subtitle: 'Kakyo Timeline',
      scrollInstruction: '絵巻をスクロールして軌跡を辿る',
      orderAsc: '古い順',
      orderDesc: '新しい順',
    },
  },
  zh: {
    common: {
      siteTitle: 'Maison de 院院',
      back: '返回',
      open: '打开',
      explore: '探索',
      listen: '聆听',
      start: '开始',
      checkIn: '办理入住',
      registry: '查看名册',
      message: '留言',
      langJa: '日本語',
      langZh: '简体中文',
      langEn: 'English',
      estYear: 'EST. 2026 • KAKYO-NO-MA',
    },
    nav: {
      timeline: '院院年表',
      archive: '院院归档',
      register: '入住申请',
      registry: '住户名册',
      kakyonoma: '院院之间',
      songs: '院院的单曲',
      diagnosis: '推活风格诊断',
      greeting: '管理员致辞',
      terms: '使用指南',
    },
    home: {
      welcome: '欢迎来到这座兼具怀旧与温馨的公寓。',
      subtext: '记录属于你的角落，与同好们共度美好时光。',
      timelineDesc: '与年表一同回顾历来的活动轨迹。',
      timelineOpen: '展开画卷 (Open)',
      archiveDesc: '回顾语音、故事、歌回歌单、二人的笔记等珍贵记录。',
      archiveOpen: '打开归档 (Explore)',
      registerDesc: '创建专属于你的个人资料，登记成为这里的一员。',
      registryDesc: '居住于此的伙伴们的记录，随时供大家浏览。',
      kakyonomaDesc: '充满和式氛围的休憩场所，大家的凝聚化作叠叠榻榻米延伸开来。',
      songsDesc: '在原创曲与翻唱曲中，挑选最契合你此刻心情的一首。',
      diagnosisDesc: '回答问题，诊断你与推相处交流的专属风格。',
      greetingDesc: '本网站建立的初心，以及献给全体住户的寄语。',
      announcements: 'Announcements',
      officeTitle: '管理役场公告',
      updated: 'Updated 2026.04',
      skipHint: '点击以跳过',
    },
    terms: {
      title: '使用指南',
      subtitle: 'Terms & Guidelines',
      error: '## 错误\n未能读取使用条款。',
      agreeCheck: '我已阅读并同意上述条款',
      agreeButton: '同意并继续',
    },
    greeting: {
      title: '致辞',
      subtitle: 'A Message from the Manager',
      authorName: '烈火Morimoto',
      authorEn: 'Rekka Morimoto',
      managerRole: 'Maison de Kyo Manager',
      error: '未能读取致辞内容。',
    },
    kakyovoice: {
      title: '院院归档',
      subtitle: 'Archive & Voice Collection',
      playRandom: '随机播放',
      filterAll: '全部',
      catDailyVoice: '每日院院语音',
      catGoodNightVoice: '晚安院院语音',
      catFutariNote: '院院Miko，二人的笔记。',
      catKyoStory: '#院院的故事',
      catOriginalSong: '原创曲',
      catCoverSong: '翻唱曲',
      catVlog: 'Vlog',
      catSetlist: '歌回歌单',
      noItems: '暂无对应项目。',
      viewPost: '查看动态',
      streamLink: '观看直播',
    },
    register: {
      title: '入住申请',
      subtitle: 'Resident Registration',
      pageTitle: '入住手续',
      instructionsTitle: '【入住手续指南】',
      instructionsText: '欢迎来到 Maison de 院院！请填写下方表格，登记你的“房间号”与“昵称”。\n登记的信息将实时反映在榻榻米房间（院院之间）及住户名册中。',
      nameLabel: '姓名 / 昵称',
      namePlaceholder: '例: 院院めいと太郎',
      buildingLabel: '楼栋（可选）',
      buildingSelect: '不指定（标准）',
      roomLabel: '房间号 (1~999)',
      roomPlaceholder: '例: 101',
      iconLabel: '头像图片（Twitter等）',
      iconHint: '建议使用正方形图片以获得最佳显示效果',
      commentLabel: '一句话寄语',
      commentPlaceholder: '例: 请多关照！',
      submitButton: '提交入住申请',
      submitting: '提交中...',
      successTitle: '入住申请已受理！',
      successText: '你的入住手续已完成。欢迎前往院院之间或住户名册查看。',
      previewTitle: '转入申请书预览',
    },
    registry: {
      title: '住户名册',
      subtitle: 'Resident Registry',
      searchPlaceholder: '按姓名或房间号搜索...',
      buildingFilterAll: '所有楼栋',
      totalCount: '总入住人数: ',
      noResidents: '未找到符合条件的住户。',
      roomSuffix: '号室',
    },
    kakyonoma: {
      title: '院院之间',
      subtitle: 'Tatami Room',
      zoomIn: '放大',
      zoomOut: '缩小',
      reset: '重置',
      dragHint: 'DRAG OR SWIPE TO PAN • WHEEL TO ZOOM',
      totalMats: '当前榻榻米总数: ',
    },
    songs: {
      title: '院院的单曲',
      subtitle: 'Today\'s Recommended Song',
      pickupSong: '今日推荐曲目',
      drawAgain: '再抽一次 🎲',
      watchOnYoutube: '在 YouTube 聆听 🎵',
      allSongs: '全曲目列表',
      original: '原创曲',
      cover: '翻唱曲',
      singingStream: '歌回直播',
    },
    diagnosis: {
      title: '推活风格诊断',
      subtitle: 'Oshi Style Diagnosis',
      startBtn: '开始诊断',
      restartBtn: '重新诊断',
      resultTitle: '你的推活风格是…',
      shareBtn: '在 X(Twitter) 分享',
    },
    timeline: {
      title: '院院年表',
      subtitle: 'Kakyo Timeline',
      scrollInstruction: '滚动画卷追溯足迹',
      orderAsc: '按时间顺序',
      orderDesc: '按倒序',
    },
  },
  en: {
    common: {
      siteTitle: 'Maison de Kyo',
      back: 'Back',
      open: 'Open',
      explore: 'Explore',
      listen: 'Listen',
      start: 'Start',
      checkIn: 'Check-in',
      registry: 'Registry',
      message: 'Message',
      langJa: '日本語',
      langZh: '简体中文',
      langEn: 'English',
      estYear: 'EST. 2026 • KAKYO-NO-MA',
    },
    nav: {
      timeline: 'Kakyo Timeline',
      archive: 'Kakyo Archive',
      register: 'Registration',
      registry: 'Resident Registry',
      kakyonoma: 'Kakyo-no-ma',
      songs: 'Song of Kyo',
      diagnosis: 'Oshi Style Diagnosis',
      greeting: 'From Manager',
      terms: 'Guidelines',
    },
    home: {
      welcome: 'Welcome to this classic residence.',
      subtext: 'Record your space and enjoy time with fellow friends.',
      timelineDesc: 'Look back at historical milestones on the timeline.',
      timelineOpen: 'Unroll Scroll (Open)',
      archiveDesc: 'Browse records of voices, talks, setlists, and notes.',
      archiveOpen: 'Open Archive (Explore)',
      registerDesc: 'Create your profile and register as a resident here.',
      registryDesc: 'Records of residents living here. Accessible anytime.',
      kakyonomaDesc: 'A traditional room where everyone\'s presence expands the tatami space.',
      songsDesc: 'Find the perfect song for your mood among originals and covers.',
      diagnosisDesc: 'Answer questions to discover your Oshi interaction style.',
      greetingDesc: 'The message and story from the manager behind this site.',
      announcements: 'Announcements',
      officeTitle: 'Manager\'s Office',
      updated: 'Updated 2026.04',
      skipHint: 'Click to skip',
    },
    terms: {
      title: 'Terms & Guidelines',
      subtitle: 'Terms & Guidelines',
      error: '## Error\nFailed to load terms and guidelines.',
      agreeCheck: 'I understand and agree to the terms',
      agreeButton: 'Agree and Proceed',
    },
    greeting: {
      title: 'Greeting',
      subtitle: 'A Message from the Manager',
      authorName: 'Rekka Morimoto',
      authorEn: 'Rekka Morimoto',
      managerRole: 'Maison de Kyo Manager',
      error: 'Failed to load greeting content.',
    },
    kakyovoice: {
      title: 'Kakyo Archive',
      subtitle: 'Archive & Voice Collection',
      playRandom: 'Random Play',
      filterAll: 'All Categories',
      catDailyVoice: 'Daily Kakyo Voice',
      catGoodNightVoice: 'Goodnight Kakyo Voice',
      catFutariNote: 'Kakyo & Miko Notes',
      catKyoStory: '#Kyo Talk',
      catOriginalSong: 'Original Songs',
      catCoverSong: 'Cover Songs',
      catVlog: 'Vlog',
      catSetlist: 'Karaoke Setlists',
      noItems: 'No items found matching your criteria.',
      viewPost: 'View Post',
      streamLink: 'Watch Stream',
    },
    register: {
      title: 'Resident Registration',
      subtitle: 'Resident Registration',
      pageTitle: 'Registration Procedure',
      instructionsTitle: '[Registration Guidelines]',
      instructionsText: 'Welcome to Maison de Kyo! Please fill out the form below to register your room number and name.\nRegistered information will be reflected in the Kakyo-no-ma tatami room and resident list.',
      nameLabel: 'Name / Nickname',
      namePlaceholder: 'e.g. Kyomate Taro',
      buildingLabel: 'Building (Optional)',
      buildingSelect: 'Default',
      roomLabel: 'Room No. (1~999)',
      roomPlaceholder: 'e.g. 101',
      iconLabel: 'Icon Image (Twitter, etc.)',
      iconHint: 'Square images look best',
      commentLabel: 'Short Message',
      commentPlaceholder: 'e.g. Nice to meet you all!',
      submitButton: 'Submit Registration',
      submitting: 'Submitting...',
      successTitle: 'Registration Received!',
      successText: 'Your registration is complete. Check out Kakyo-no-ma or the Resident Registry.',
      previewTitle: 'Registration Preview',
    },
    registry: {
      title: 'Resident Registry',
      subtitle: 'Resident Registry',
      searchPlaceholder: 'Search by name or room number...',
      buildingFilterAll: 'All Buildings',
      totalCount: 'Total Residents: ',
      noResidents: 'No residents found matching your search.',
      roomSuffix: ' Room',
    },
    kakyonoma: {
      title: 'Kakyo-no-ma',
      subtitle: 'Tatami Room',
      zoomIn: 'Zoom In',
      zoomOut: 'Zoom Out',
      reset: 'Reset',
      dragHint: 'DRAG OR SWIPE TO PAN • WHEEL TO ZOOM',
      totalMats: 'Total Tatami Mats: ',
    },
    songs: {
      title: 'Song of Kyo',
      subtitle: 'Today\'s Recommended Song',
      pickupSong: 'Today\'s Picked Song',
      drawAgain: 'Pick Again 🎲',
      watchOnYoutube: 'Listen on YouTube 🎵',
      allSongs: 'All Songs List',
      original: 'Original Songs',
      cover: 'Cover Songs',
      singingStream: 'Karaoke Stream',
    },
    diagnosis: {
      title: 'Oshi Style Diagnosis',
      subtitle: 'Oshi Style Diagnosis',
      startBtn: 'Start Diagnosis',
      restartBtn: 'Diagnose Again',
      resultTitle: 'Your Oshi Style is...',
      shareBtn: 'Share on X (Twitter)',
    },
    timeline: {
      title: 'Kakyo Timeline',
      subtitle: 'Kakyo Timeline',
      scrollInstruction: 'Scroll the scroll to trace the journey',
      orderAsc: 'Oldest First',
      orderDesc: 'Newest First',
    },
  },
};
