const fs = require('fs');
const path = require('path');

const txtPath = path.join(__dirname, '../data/song_list.txt');
const htmlPath = path.join(__dirname, '../public/song_list.html');

function generateHtml() {
    try {
        if (!fs.existsSync(txtPath)) {
            console.error(`Error: Source file not found at ${txtPath}`);
            return;
        }

        const content = fs.readFileSync(txtPath, 'utf8');
        const lines = content.split('\n');

        const sections = [];
        let currentSection = null;
        let currentSong = null;

        for (let line of lines) {
            line = line.trim();
            if (!line) continue;

            if (line.startsWith('■')) {
                // 新しいセクション（配信）の開始
                const title = line.replace(/^■\s*/, '');
                currentSection = { title, songs: [], link: null };
                sections.push(currentSection);
                currentSong = null;
            } else if (line.startsWith('- 配信リンク:')) {
                // セクション全体の配信アーカイブリンク
                if (currentSection) {
                    currentSection.link = line.replace(/^- 配信リンク:\s*/, '');
                }
            } else if (line.startsWith('- URL:')) {
                // 直前の曲に対する個別リンク
                if (currentSong) {
                    currentSong.url = line.replace(/^- URL:\s*/, '');
                }
            } else {
                // 曲名
                currentSong = { title: line, url: null };
                if (currentSection) {
                    currentSection.songs.push(currentSong);
                }
            }
        }

        // HTMLのヘッダーと共通スタイル・構造の定義
        const htmlHeader = `<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>佳鏡院さん歌枠セトリまとめ</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Kosugi+Maru&family=M+PLUS+Rounded+1c:wght@400;700&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'M PLUS Rounded 1c', 'Kosugi Maru', sans-serif;
            background-color: #E0F7FA; /* Light Blue Background */
            color: #444;
            padding: 40px;
            max-width: 800px;
            margin: 0 auto;
            line-height: 1.6;
        }
        h1 {
            text-align: center;
            color: #00838F; /* Darker Blue for Title */
            font-size: 2.5em;
            margin-bottom: 40px;
            text-shadow: 2px 2px 0px #fff;
            border-bottom: 3px dashed #80DEEA;
            padding-bottom: 15px;
        }
        .stream-section {
            background-color: #fff;
            border-radius: 20px;
            padding: 25px;
            margin-bottom: 30px;
            box-shadow: 0 4px 15px rgba(178, 235, 242, 0.6);
            border: 2px solid #B2EBF2;
        }
        h2 {
            color: #00BCD4;
            font-size: 1.5em;
            margin-top: 0;
            margin-bottom: 20px;
            padding-left: 10px;
            border-left: 5px solid #26C6DA;
        }
        .song-item {
            margin-bottom: 15px;
            padding-bottom: 10px;
            border-bottom: 1px dotted #E0F7FA;
        }
        .song-item:last-child {
            border-bottom: none;
        }
        .song-title, .song-title-link {
            font-weight: bold;
            font-size: 1.1em;
            color: #006064;
            text-decoration: none;
            display: inline-block;
        }
        .song-title-link {
            transition: color 0.3s, transform 0.2s;
            cursor: pointer;
        }
        .song-title-link:hover {
            color: #0097A7;
            text-decoration: underline;
            transform: translateX(5px);
        }
        .song-link {
            display: block;
            color: #0097A7;
            text-decoration: none;
            font-size: 0.9em;
            margin-top: 2px;
        }
        .song-link:hover {
            text-decoration: underline;
        }
        /* Page Break for Printing */
        @media print {
            body { 
                background-color: #fff; /* Save ink */
                -webkit-print-color-adjust: exact; 
                print-color-adjust: exact;
            } 
            .stream-section {
                break-inside: avoid;
                page-break-inside: avoid;
                box-shadow: none;
                border: 2px solid #B2EBF2;
            }
        }
        /* Search Bar Styles */
        .search-container {
            margin-bottom: 30px;
            text-align: center;
        }
        #search-input {
            width: 100%;
            max-width: 500px;
            padding: 12px 20px;
            font-size: 1.1em;
            border: 2px solid #B2EBF2;
            border-radius: 30px;
            outline: none;
            transition: all 0.3s;
            font-family: inherit;
            box-shadow: 0 4px 10px rgba(178, 235, 242, 0.4);
            color: #006064;
            background-color: #fff;
        }
        #search-input::placeholder {
            color: #80DEEA;
        }
        #search-input:focus {
            border-color: #00BCD4;
            box-shadow: 0 4px 15px rgba(0, 188, 212, 0.4);
        }
    </style>
</head>
<body>

    <h1>佳鏡院さん歌枠セトリまとめ</h1>

    <div class="search-container">
        <input type="text" id="search-input" placeholder="曲名やアーティスト名で検索...">
    </div>
`;

        // 各セクションおよび曲情報をHTMLに変換
        let bodyContent = '';
        for (const section of sections) {
            bodyContent += '    <div class="stream-section">\n';
            bodyContent += `        <h2>${section.title}</h2>\n`;
            
            // 全体リンクがある場合はそのラッパーを出力
            if (section.link) {
                bodyContent += '        <div class="song-link-wrapper" style="margin-bottom: 15px;">\n';
                bodyContent += `            <a href="${section.link}" class="song-link" target="_blank">📺 配信アーカイブ</a>\n`;
                bodyContent += '        </div>\n';
            }

            // 各曲の出力
            for (const song of section.songs) {
                bodyContent += '        <div class="song-item">\n';
                if (song.url) {
                    bodyContent += `            <a href="${song.url}" class="song-title-link" target="_blank">${song.title}</a>\n`;
                } else {
                    bodyContent += `            <div class="song-title">${song.title}</div>\n`;
                }
                bodyContent += '        </div>\n';
            }
            bodyContent += '    </div>\n\n';
        }

        // フッターと検索スクリプトの定義
        const htmlFooter = `    <script>
        document.getElementById('search-input').addEventListener('input', function(e) {
            const query = e.target.value.toLowerCase().trim();
            const sections = document.querySelectorAll('.stream-section');

            sections.forEach(section => {
                const items = section.querySelectorAll('.song-item');
                let hasMatch = false;

                items.forEach(item => {
                    const text = item.textContent.toLowerCase();
                    if (text.includes(query)) {
                        item.style.display = '';
                        hasMatch = true;
                    } else {
                        item.style.display = 'none';
                    }
                });

                // 配信アーカイブリンク等の表示制御
                const linkWrapper = section.querySelector('.song-link-wrapper');
                if (linkWrapper) {
                    if (query === '' || hasMatch) {
                        linkWrapper.style.display = '';
                    } else {
                        linkWrapper.style.display = 'none';
                    }
                }

                // 一致する曲があるか、クエリが空ならセクションを表示。なければ非表示。
                if (hasMatch || query === '') {
                    section.style.display = '';
                } else {
                    section.style.display = 'none';
                }
            });
        });
    </script>

</body>
</html>
`;

        const fullHtml = htmlHeader + bodyContent + htmlFooter;
        fs.writeFileSync(htmlPath, fullHtml, 'utf8');
        console.log(`Successfully generated HTML at ${htmlPath}`);

    } catch (err) {
        console.error('Failed to generate song list HTML:', err);
    }
}

generateHtml();
