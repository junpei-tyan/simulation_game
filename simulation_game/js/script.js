// mp3ファイルを読み込み
const next_text_sound = new Audio("../audio/next_button.mp3");
const log_close_sound = new Audio("../audio/log_close_button.mp3");

// 各処理のグローバル切り替えフラグ
let first_next_button_animation = true; // 次へボタンのアニメーションの切り替え
let text_display_flg = false; // 次へボタンの関数の実行切り替え
let log_sidebar_flg = false // サイドバーの表示切り替え
let name_tag_flg = false; // ネームタグの表示切り替え
let log_animation_flg = false; // ログの処理実行切り替え
let log_next_flg = false; // ログを開いている間のEnterキー実行切り替え
let option_flg = false; // 選択肢の処理実行切り替え
let player_text_flg = false; // ログに追加するテキストの切り替え
let option_selected_flg = false; // 選択肢を選択した時のフラグ
let text_skip_flg = false; // テキストをキャンセルするためのフラグ

const name_tag = document.getElementById("name_tag_h1"); // ネームタグをグローバルで宣言
const character_img = document.getElementById("character_img"); // キャラクターの画像をグローバルで宣言

const character_name = localStorage.getItem("character_name"); //ローカルストレージから取得したキャラクター名をグローバルで宣言
const player_name = localStorage.getItem("player_name"); //ローカルストレージから取得したプレイヤー名をグローバルで宣言

// リピートするアニメーションの関数をグローバル関数として定義
let repeat_animation;

const current_text = document.getElementById("current_text"); // 現在のテキストを取得
let current_index = 0;
let next_text_num = 0; // 表示するテキストのリスト番号

// ページのURLを取得
const url = location.href;

// 各ルートの切り替えフラグ
let Kitamura_root_flg = false;
let Hukaya_root_flg = false;
let Komatsu_root_flg = false;
let Hashidume_root_flg = false;
let Katura_root_flg = false;

// index.htmlのみ有効
if (url == "file:///Users/User/Documents/vantan%202024/simulation_game/tamplate/index.html") {
    // Keydownイベント
    document.addEventListener("keydown", function(event) {
        if (option_flg && !log_sidebar_flg) { // 選択肢が表示されている時のみ有効
            if (event.key == "1") {
                jump_1();
                next_text_sound.play(); // mp3ファイルを再生
            } else if (event.key == "2") {
                jump_2();
                next_text_sound.play(); // mp3ファイルを再生
            }
        } else {
            if (event.key == "Enter" && text_display_flg && !log_next_flg) {
                next_text(event);
            } else if(event.key == " " && !log_next_flg) {
                next_text(event);
            }
        }

        // Escapeキーを押すとログを表示
        if (event.key == "Escape") {
            log_animation();
        }
    });

    // 一番最初に表示されるセリフ
    window.onload = function() {
        let text_list = ["今日から念願の初出勤！どんな人がいるのか楽しみだなあ"];

        name_tag.textContent = player_name; // ネームタグにプレイヤー名を挿入

        if (character_name == "キタムラ") { // 喜多村さんルート
            Kitamura_root_flg =  true;
        } else if (character_name == "フカヤ") { // 深谷さんルート
            Hukaya_root_flg = true;
        } else if (character_name == "コマツ") { // 小松さんルート
            Komatsu_root_flg = true;
        } else if (character_name == "ハシヅメ") { // 橋爪さんルート
            Hashidume_root_flg = true;
        } else if (character_name == "カツラ") { // 桂さんルート
            Katura_root_flg = true;
        } // 隠しルートも作る予定

        first_next_button_animation = false;
        
        setTimeout(function() {
            show_text(text_division(text_list));
        }, 250);
        next_text_num += 1; // テキストのリスト番号を一つ進める
        console.log(`*最初のセリフ (現在のテキスト番号 : ${next_text_num})`); // 現在のテキスト番号 (デバッグ用)
    }
}

// title.htmlのみ有効
if (url == "file:///Users/User/Documents/vantan%202024/simulation_game/tamplate/title.html") {
    window.onload = function() {
        localStorage.removeItem("player_name"); // プレイヤー名をローカルストレージから削除
    }
    // プレイヤーの名前を取得
    document.getElementById("player_name_input").addEventListener("keydown", function(event) { // Enterキーが入力されたら変数にプレイヤー名を格納
        if (event.key == "Enter") {
            event.preventDefault(); // フォームの送信を防ぐ

            let player_name = document.getElementById("player_name_input").value;
            localStorage.setItem("player_name", player_name); // プレイヤー名をローカルストレージに保存(ページが遷移される際に変数が初期化されるため)

            document.getElementById("player_name_text").textContent =`あなたの名前は、${player_name}です。(現在の文字数 : ${player_name.length}文字)`;
        }
    });
}

// キャラクターを選択
function character_select(character_name) {
    alert(character_name + "さんルートを選択"); // 仮でアラート

    localStorage.setItem("character_name", character_name); // キャラクター名をローカルストレージに保存
}

// テキストを分割
function text_division(passed_text_list) {
    let next_text = passed_text_list[0];
    document.getElementById("current_text").innerHTML = ""; // 現在のテキストを初期化

    text_list = []; // リストをリセット
    text_list = [...next_text]; // 新しいテキストを分割

    return text_list; // 分割したテキストを戻り値として返す
}

// 次へボタンを押した時の処理
async function next_text(event) {
    let current_text = document.getElementById("current_text"); // 現在のテキストを取得
    current_text.innerHTML = ""; // 現在のテキストを初期化

    if (text_display_flg == true) {
        let next_button = document.getElementById("next_button"); // 次へボタンを取得
        let name_tag_box = document.getElementById("name_tag"); // ネームタグを取得
        let text_list = [];

        text_skip_flg = false;
        text_display_flg = false;
        first_next_button_animation = false; // 関数が実行されたらアニメーションのリピートを停止

        next_text_sound.play(); // mp3ファイルを再生
        next_text_num += 1; // テキストのリスト番号を一つ進める

        if (next_text_num == 2) { // 全ルート共通
            name_tag_box.style.display = "none"; // ネームタグを非表示
            text_list = ["〜バンタン2階〜"];
        } else if (next_text_num == 3) { // 全ルート共通
            name_tag_box.style.display = "block"; // ネームタグを表示
            text_list = ["おはようございます！初めまして！"];
        } else if (next_text_num == 4) {

            if (Kitamura_root_flg) {
                name_tag.textContent = character_name;
                character_img.src = "../img/character/Kitamura/Kitamura_1.png";
                character_img.style.padding = "0";

                text_list = ["おはやざっす。初めまして、今日からっすか？"];
            }

        } else if(next_text_num == 5) { // 全ルート共通
            name_tag.textContent = player_name;
            text_list = ["はい！初めてなので授業見学させていただいてもよろしいでしょうか？"];
        } else if(next_text_num == 6) {

            if (Kitamura_root_flg) {
                name_tag.textContent = character_name;
                text_list = ["あぁ、全然いいっすよ！"];
            }

        } else if (next_text_num == 7) {

            if (Kitamura_root_flg) {
                character_img.src = "#";
                name_tag_box.style.display = "none";
                text_list = ["〜5階 501教室〜"];
            }

        } else if (next_text_num == 8) {

            if (Kitamura_root_flg) {
                character_img.src = "../img/character/Kitamura/Kitamura_4.png";
                character_img.style.padding = "50px 0 0 0";
                name_tag_box.style.display = "block";

                text_list = ["うぇ！？マジッすか！？んなことあったんすか！マジそれやばくねぇー！？"];
            }

        } else if (next_text_num == 9) {

            if (Kitamura_root_flg) {
                name_tag.textContent = "生徒A";
                text_list = ["そうなんすよ！"];
            }

        } else if (next_text_num == 10) {

            if (Kitamura_root_flg) {
                name_tag.textContent = player_name;
                text_list = ["この先生はこんな感じなんだー！"];
            }

        } else if (next_text_num == 11) {
            
            if (Kitamura_root_flg) {
                character_img.src = "#";
                name_tag_box.style.display = "none";
                text_list = ["〜授業後〜"];
            }

        } else if (next_text_num == 12) {

            if (Kitamura_root_flg) {
                name_tag_box.style.display = "block";
                name_tag.textContent = player_name;

                text_list = ["授業お疲れ様でした。"];
            }
        } else if (next_text_num == 13) {

            if (Kitamura_root_flg) {
                character_img.src = "../img/character/Kitamura/Kitamura_1.png";
                character_img.style.padding = "0";
                name_tag.textContent = character_name;

                text_list = ["お疲れっす、どうでしたか僕の授業は？"];
            }

        } else if (next_text_num == 14) {

            if (Kitamura_root_flg) {
                name_tag.textContent = player_name;
                text_list = ["話が分かりやすくって面白かったです！"];
            }

        } else if (next_text_num == 15) {

            if (Kitamura_root_flg) {
                name_tag.textContent = character_name;
                text_list = ["本当っすか！それなら良かったっす（照れ///）"];
            }

        } else if (next_text_num == 16) {

            if (Kitamura_root_flg) {
                name_tag.textContent = player_name;
                text_list = ["今日はありがとうございました"];
            }

        } else if (next_text_num == 17) {

            if (Kitamura_root_flg) {
                name_tag.textContent = character_name;
                text_list = ["またなんかあればいつでも言ってください！"];
            }

        } else if (next_text_num == 18) {

            if (Kitamura_root_flg) {
                name_tag.textContent = player_name;
                text_list = ["はい！"];
            }

        } else { // 選択肢があるテキストの場合
            name_tag.textContent = character_name; // ネームタグをキャラクター名に変更

            // 次へボタンを非表示
            async function next_button_hidden() {
                await new Promise(resolve => setTimeout(resolve, 310));
                next_button.style.display = "none";

                await new Promise(resolve => setTimeout(resolve, 500));
                show_text(text_division(text_list));
            }
            next_button_hidden();
        }
        show_text(text_division(text_list));

        // 次へボタンを非表示
        setTimeout(function() {
            next_button.style.display = "none";
        }, 310);

    } else if (event.key == " ") { // スペースキーを押すとテキストをスキップする
        text_skip_flg = true;
        text_display_flg = true;
        
        current_text.textContent = text_list.join(""); // テキストの全文を表示する
        log_add(text_list); // ログにセリフを追加
    }
    console.log("現在のテキスト番号 : " + String(next_text_num)); // 現在のテキスト番号 (デバッグ用)
}

// テキストを一文字づつ表示
async function show_text(passed_text_list) {
    return new Promise(async (resolve) => {
        if (text_skip_flg) {
            resolve();
            return;
        }
        if (current_index < passed_text_list.length) {
            if (option_selected_flg) {
                let current_text = document.getElementById("current_text");
                let text_window = document.getElementById("text_window");
                let character_img = document.getElementById("character_img_box");
    
                async function text_window_reset() {
                    await new Promise(resolve => setTimeout(resolve, 775));
                    text_window.style.display = "flex"; // テキストウィンドウのdisplayを元に戻す(flex)
                    text_window.style.height = "250px"; // テキストウィンドウの高さを元に戻す
                    character_img.className = "character_img_box"; // キャラクターの背景を元に戻す
                    current_text.className = "current_text"; // 現在のテキストのクラスを元に戻す
                    name_tag.textContent = character_name; // ネームタグをキャラクター名に変更
    
                    await new Promise(resolve => setTimeout(resolve, 1075));
                    current_text.innerHTML = current_text.innerHTML.concat(passed_text_list[current_index]); // 新しいテキストを挿入
                    current_index++;
                    setTimeout(function() {
                        show_text(passed_text_list).then(resolve);
                    }, 100);
                }
                text_window_reset();
                
                option_selected_flg = false;
                next_text_num += 1;
            } else {
                current_text.innerHTML = current_text.innerHTML.concat(passed_text_list[current_index]); // 新しいテキストを挿入
                current_index++;
                setTimeout(function() {
                    if (!text_skip_flg) {
                        show_text(passed_text_list).then(resolve);
                    } else {
                        resolve();
                    }
                }, 100);
            }
        } else {
            if (player_text_flg) {
                log_add(passed_text_list);
    
                current_index = 0; // テキストのindex番号をリセット
                text_display_flg = true; // Enterキー入力を受け付け
            } else {
                log_add(passed_text_list); // テキストをログに追加
    
                current_index = 0; // テキストのindex番号をリセット
                text_display_flg = true; // Enterキー入力を受け付け
    
                if (next_text_num != 9999) { // 選択肢があるテキスト以外の場合 (通常テキスト)
                    setTimeout(function() {
                        async function next_button_display() {
                            delayed_display();
                            await new Promise(resolve => setTimeout(resolve, 500));
                            first_next_button_animation = true;
                        }
                        next_button_display();
                    }, 200);
                }
            }
            resolve();
        }
    });
}

// テキストをログに追加
function log_add(passed_text_list, passed_option_addition) {
    let original_text = passed_text_list.join("") // 分割したテキストを元に戻す
    let log_text_box = document.createElement("div"); // 新しく<div>要素を作成する
    let log_text = document.createElement("p"); // セリフを入れる<p>要素を作成する
    let log_name_tag = document.createElement("p"); // ネームタグを入れる<p>要素を作成する
    let option_addition = document.createElement("p"); // 選択肢を選んだ場合のセリフに追加するテキストを入れる<p>要素を作成する

    log_text_box.className = "log_text_box"; // 作成した<div>要素にclassをつける
    log_text.className = "log_text"; // 作成したセリフを入れる<p>要素にclassをつける
    log_name_tag.className = "log_name_tag"; // 作成したネームタグを入れる<p>要素にclassをつける
    option_addition.className = "option_addition"; // 作成したセリフに追加するテキストにclassをつける

    log_text.textContent = original_text;
    option_addition.textContent = passed_option_addition;

    // <div>要素にネームタグの<p>要素を追加
    log_text_box.appendChild(log_name_tag);

    if (name_tag_flg == true) { // プレイヤーのセリフの場合
        let log_text_player_box = document.createElement("div"); // 選択肢を選んだ場合のテキストを入れる<div>要素を作成

        log_text_player_box.style.display = "flex";
        option_addition.style.color = "#fff";
        option_addition.style.margin = "0 15px 0 0";

        log_text_player_box.appendChild(option_addition);
        log_text_player_box.appendChild(log_text);
        log_text_box.appendChild(log_text_player_box);

        log_name_tag.textContent = player_name; // ネームタグにプレイヤー名を入れる

        let player_log_text = log_name_tag.nextElementSibling; // プレイヤー名の兄弟要素(プレイヤーのセリフ)を取得
        player_log_text.style.color = "lightgreen"; // プレイヤーのセリフのスタイルを変更

        name_tag_flg = false
    } else { // キャラクターのセリフの場合
        log_text_box.appendChild(log_text);
        log_name_tag.textContent = character_name; // ネームタグにキャラクター名を入れる
    }

    let log_sidebar_text = document.getElementById("log_sidebar_text"); // 作成した<div>要素と<p>要素を配置する親要素を取得
    log_sidebar_text.appendChild(log_text_box); // ログにテキストボックスを配置
}

// テキストが表示し終わってからボタンを表示する
function delayed_display() {
    document.getElementById("next_button").style.display = "block";
}

// ログを表示、非表示
function log_animation() {
    let log_sidebar = document.getElementById("log_sidebar");
    let log_icon = document.getElementById("log_icon");

    log_sidebar.style.display = "block"; // ログの状態を"表示"に

    if (!log_animation_flg) {
        if (!log_sidebar_flg) { // ログを表示
            log_next_flg = true;
            log_animation_flg = true;

            next_text_sound.play(); // mp3ファイルを再生
    
            async function log_display_animation() {
                await new Promise(resolve => setTimeout(resolve, 100));
            
                log_sidebar.className = "log_sidebar_animation"; // アニメーションを設定しているクラスに変更
            
                // ログボタンのスタイルを変更
                log_icon.src = "../img/log_cancel.svg";
                log_icon.style.width = "30px";
                log_icon.style.margin = "15.5px 0 0 0";

                log_animation_flg = false;
            }
            log_display_animation();
        
            log_sidebar_flg = true;
        } else {// ログを非表示
            log_animation_flg = true;
            log_next_flg = false;

            log_sidebar.className = "log_sidebar"; // 元のクラスに戻す
            log_close_sound.play(); // mp3ファイルを再生
        
            // ログボタンのスタイルを変更
            log_icon.src = "../img/log_button_icon.svg";
            log_icon.style.width = "25px";
            log_icon.style.margin = "17.5px 0 0 0";
        
            async function log_close_animation() {
                await new Promise(resolve => setTimeout(resolve, 250));
                document.getElementById("log_box").style.display = "block"; // ログのボタンを表示
            
                await new Promise(resolve => setTimeout(resolve, 410));
                log_sidebar.style.display = "none"; // ログを非表示

                log_animation_flg = false;
            }
            log_close_animation();
        
            log_sidebar_flg = false;
        }
    }
}

// 選択肢を表示
function option_display() {
    let text_window = document.getElementById("text_window"); // テキストウィンドウを取得
    let option = document.getElementById("option"); // 選択肢を取得
    let option_text1 = document.getElementById("option_text1"); // 一つ目の選択肢を取得
    let option_text2 = document.getElementById("option_text2"); // 二つ目の選択肢を取得
    let current_text = document.getElementById("current_text"); // 現在のテキストを取得

    let option_text_list = ["コマッた様子のコマツさん。どうしようか？"];
    let option_text = ["一緒に財布を探してあげる", "(コマツの財布を見せびらかす)"]; // 選択肢のテキスト

    name_tag.textContent = player_name; // ネームタグのテキストを変更
    text_window.style.display = "block"; // テキストウィンドウのdisplayをflexからblockに変更

    // 選択肢にテキストを挿入する
    option_text1.textContent = option_text[0];
    option_text2.textContent = option_text[1];

    player_text_flg = true;

    setTimeout(function() {
        current_text.className = "current_text_option"; // 表示されているテキストを選択肢バージョンに変更
        document.getElementById("character_img_box").className = "character_img_box_option" // キャラクターコンテナのクラスを変更
        name_tag_flg = true;
        
        async function option_text_display() {
            await show_text(text_division(option_text_list)) // テキストを次に進める
            setTimeout(function() {
                text_window.style.height = "350px"; // テキストウィンドウの高さを変更
                option.style.display = "block" // 選択肢を表示
                option_flg = true;
            }, 250);
        }
        option_text_display();
    }, 500);
}

// 選択肢によって分岐
function option(num) {
    if (option_flg) {
        if (num == 1) {
            jump_1();
        } else {
            jump_2();
        }
        next_text_sound.play(); // mp3ファイルを再生
    }
}

// それぞれの選択肢を選んだときの処理
function jump_1() {
    option_selected_flg = true;
    text_list = ["本当ですか！　助かります！"]; // 表示するテキスト

    let option_box1 = document.getElementById("option_box1");
    let option_box2 = document.getElementById("option_box2");

    option_box1.className = "option_box_animation"; // 選択肢のクラスをアニメーションの設定されているクラスに変更
    option_box2.style.display = "none"; // 選択していない選択肢を非表示

    let option_text1_addition = "＞";
    let option_text1 = document.getElementById("option_text1").textContent; // 選択肢のテキストを取得
    let passed_text_list = [];
    passed_text_list = [option_text1]; // log_add関数に引き渡すリストに選択肢のテキストを追加

    show_text(text_division(text_list));

    name_tag_flg = true;
    log_add(passed_text_list, option_text1_addition);

    setTimeout(function() {
        document.getElementById("option").style.display = "none"; // 選択肢を遅延して非表示
    }, 750);

    player_text_flg = false;
    option_flg = false;
}

function jump_2() {
    option_selected_flg = true;
    text_list = ["ちょっと！！　返してくださいよ！！"]; // 表示するテキスト

    let option_box2 = document.getElementById("option_box2");
    let option_box1 = document.getElementById("option_box1");

    option_box2.className = "option_box_animation"; // 選択肢のクラスをアニメーションの設定されているクラスに変更
    option_box1.style.display = "none"; // 選択していない選択肢を非表示

    let option_text2_addition = "＞";
    let option_text2 = document.getElementById("option_text2").textContent; // 選択肢のテキストを取得
    let passed_text_list = [];
    passed_text_list = [option_text2]; // log_add関数に引き渡すリストに選択肢のテキストを追加

    show_text(text_division(text_list));

    name_tag_flg = true;
    log_add(passed_text_list, option_text2_addition);

    setTimeout(function() {
        document.getElementById("option").style.display = "none"; // 選択肢を遅延して非表示
    }, 750);

    player_text_flg = false;
    option_flg = false;
}
