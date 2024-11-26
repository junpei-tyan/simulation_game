// mp3ファイルを読み込み
const next_text_sound = new Audio("../audio/next_button.mp3");
const log_close_sound = new Audio("../audio/log_close_button.mp3");
const game_start_sound = new Audio("../audio/game_start.mp3");

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
let narration_flg = false; // ナレーションなどのセリフ切り替えフラグ
let nameless_flg = false; // プレイヤー、キャラクター以外のセリフ切り替えフラグ
let loading_flg = false; // ローディング処理の切り替えフラグ
let direct_option_flg = false; // 選択肢のテキスト切り替えフラグ
let end_flg = false; // ゲーム終了の切り替えフラグ
let game_start_flg = false; // ゲームスタートの切り替えフラグ

// 選択肢の切り替えフラグ
let option1_flg = false;
let option2_flg = false;

const name_tag = document.getElementById("name_tag_h1"); // ネームタグをグローバルで宣言
const character_img = document.getElementById("character_img"); // キャラクターの画像をグローバルで宣言

const character_name = localStorage.getItem("character_name"); //ローカルストレージから取得したキャラクター名をグローバルで宣言
const player_name = localStorage.getItem("player_name"); //ローカルストレージから取得したプレイヤー名をグローバルで宣言

// リピートするアニメーションの関数をグローバル関数として定義
let repeat_animation;

const current_text = document.getElementById("current_text"); // 現在のテキストを取得
let current_index = 0;
let next_text_num = 0; // 表示するテキストのリスト番号
let favourable_impression = 50; // 好感度
let first_person = localStorage.getItem("gender"); // 一人称

// ページのURLを取得
const url = location.href;

// 各ルートの切り替えフラグ
let root_list = {
    Kitamura_root_flg: true,
    Hukaya_root_flg: true,
    Komatsu_root_flg: true,
    Hashidume_root_flg: true,
    Katura_root_flg: true,
}

let delivery_text = "";
let delivery_text_list = [];
let delivery_img = "";

// index.htmlのみ有効
if (url == "file:///Users/User/Documents/vantan%202024/simulation_game/template/index.html") {
    // Keydownイベント
    document.addEventListener("keydown", function(event) {
        if (option_flg && !log_sidebar_flg) { // 選択肢が表示されている時のみ有効
            if (event.key == "1" || event.key == "2") {
                option(Number(event.key));
                next_text_sound.play(); // mp3ファイルを再生
            }
        } else {
            if (event.key == "Enter" && text_display_flg && !log_next_flg) {
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
        const loading = document.getElementById("loading");
        const name_tag_box = document.getElementById("name_tag");
        let text_list = [];
        loading.className = "first_loading";

        setTimeout(() => {
            document.getElementById("main_box").style.display = "block";

            loading.className = "loading";
            loading.style.zIndex = 50;
            loading.style.opacity = 0;
            name_tag.textContent = player_name; // ネームタグにプレイヤー名を挿入

            if (character_name == "キタムラ") { // 喜多村さんルート
                for (let key in root_list) {
                    if (key !== "Kitamura_root_flg") {
                        root_list[key] = !root_list[key];
                        localStorage.setItem("character_root", "Kitamura");
                    }
                }
                text_list = ["今日から念願の初出勤！どんな人がいるのか楽しみだなあ"];

            } else if (character_name == "フカヤ") { // 深谷さんルート
                for (let key in root_list) {
                    if (key !== "Hukaya_root_flg") {
                        root_list[key] = !root_list[key];
                        localStorage.setItem("character_root", "Hukaya");
                    }
                }
                document.getElementById("name_tag").style.display = "none";
                narration_flg = true;
                text_list = ["〜バンタン 2階〜"];

            } else if (character_name == "コマツ") { // 小松さんルート
                for (let key in root_list) {
                    if (key !== "Komatsu_root_flg") {
                        root_list[key] = !root_list[key];
                        localStorage.setItem("character_root", "Komatsu");
                    }
                }
                text_list = ["おはようございます！初めまして！"];

            } else if (character_name == "ハシヅメ") { // 橋爪さんルート
                for (let key in root_list) {
                    if (key !== "Hashidume_root_flg") {
                        root_list[key] = !root_list[key];
                        localStorage.setItem("character_root", "Hashidume");
                    }
                }
                text_list = ["バンタンの職員として今日は初めての出勤日！遅刻しないように早く行かなきゃ…"];

            } else if (character_name == "カツラ") { // 桂さんルート
                for (let key in root_list) {
                    if (key !== "Katura_root_flg") {
                        root_list[key] = !root_list[key];
                        localStorage.setItem("character_root", "Katura");
                    }
                }
                name_tag_box.style.display = "none";
                text_list = ["〜バンタン 2階〜"];
            }

            first_next_button_animation = false;
            name_tag_flg = true;
            
            setTimeout(() => {
                show_text(text_division(text_list));
            }, 750);
            setTimeout(() => {
                loading.style.display = "none";
            }, 3000);
            next_text_num += 1; // テキストのリスト番号を一つ進める
            console.log(`*最初のセリフ (現在のテキスト番号 : ${next_text_num})`); // 現在のテキスト番号 (デバッグ用)
        }, 1000);
    }
}

// title.htmlのみ有効
if (url == "file:///Users/User/Documents/vantan%202024/simulation_game/template/title.html") {
    window.onload = function() {
        // ローカルストーレジから各要素を削除
        localStorage.removeItem("player_name", "favourable_impression", "character_name", "gender");

        const loading = document.getElementById("loading");
        loading.className = "first_loading";

        setTimeout(() => {
            loading.className = "loading";
            loading.style.zIndex = 50;
            loading.style.opacity = 0;

            setTimeout(() => {
                loading.style.display = "none";
            }, 1500)
        }, 1000)
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

    document.addEventListener("keydown", function(event) {
        if (event.key == "Enter" && !game_start_flg) {
            Enter_hidden();
            game_start_flg = true;
        }
    });
}

// ending.htmlのみ有効
if (url == "file:///Users/User/Documents/vantan%202024/simulation_game/template/ending.html") {
    window.onload = function() {
        const loading = document.getElementById("loading");
        const favourable_impression = localStorage.getItem("favourable_impression");
        const character_root = localStorage.getItem("character_root");
        const ending_character_img = document.getElementById("ending_character_img");

        let ending_title = document.getElementById("ending_h1");
        let ending_text1 = document.getElementById("ending_text1");
        let ending_text2 = document.getElementById("ending_text2");
        let ending_text3 = document.getElementById("ending_text3");

        loading.className = "first_loading";        
        if (favourable_impression > 60) {
            ending_title.textContent = "攻略成功";
            ending_text1.textContent = "〜大変よくできました〜"
            ending_text2.textContent = `好感度 { ${favourable_impression} }`;
            ending_text3.textContent = "これであなたも立派なバンタンスタッフです！";

            if (character_root == "Kitamura") {
                ending_character_img.src = "../img/character/Kitamura/Kitamura_3.png";
            } else if (character_root == "Hukaya") {
                ending_character_img.src = "../img/character/Hukaya/Hukaya_3.png";
            } else if (character_root == "Komatsu") {
                ending_character_img.src = "../img/character/Komatsu/Komatsu_3.png";
            } else if (character_root == "Hashidume") {
                ending_character_img.src = "../img/character/Hashidume/Hashidume_3.png";
            } else if (character_root == "Katura") {
                ending_character_img.src = "../img/character/Katura/Katura_6.png";
            }
            
        } else if (favourable_impression > 40) {
            ending_title.textContent = "攻略成功";
            ending_text1.textContent = "〜よくできました〜"
            ending_text2.textContent = `好感度 { ${favourable_impression} }`;
            ending_text3.textContent = "より良い結果を目指してもう一度チャレンジしてみましょう！";

            if (character_root == "Kitamura") {
                ending_character_img.src = "../img/character/Kitamura/Kitamura_4.png";
            } else if (character_root == "Hukaya") {
                ending_character_img.src = "../img/character/Hukaya/Hukaya_2.png";
            } else if (character_root == "Komatsu") {
                ending_character_img.src = "../img/character/Komatsu/Komatsu_2.png";
            } else if (character_root == "Hashidume") {
                ending_character_img.src = "../img/character/Hashidume/Hashidume_2.png";
            } else if (character_root == "Katura") {
                ending_character_img.src = "../img/character/Katura/Katura_2.png";
            }

        } else if (favourable_impression <= 40) {
            ending_title.textContent = "攻略失敗";
            ending_text1.textContent = "〜がんばりましょう〜";
            ending_text2.textContent = `好感度 { ${favourable_impression} }`;
            ending_text3.textContent = "次はもっと良い結果になると良いですね！";

            if (character_root == "Kitamura") {
                ending_character_img.src = "../img/character/Kitamura/Kitamura_2.png";
            } else if (character_root == "Hukaya") {
                ending_character_img.src = "../img/character/Hukaya/Hukaya_4.png";
            } else if (character_root == "Komatsu") {
                ending_character_img.src = "../img/character/Komatsu/Komatsu_5.png";
            } else if (character_root == "Hashidume") {
                ending_character_img.src = "../img/character/Hashidume/Hashidume_4.png";
            } else if (character_root == "Katura") {
                ending_character_img.src = "../img/character/Katura/Katura_5.png";
            }
        }

        setTimeout(() => {
            loading.className = "loading";
            loading.style.zIndex = 50;
            loading.style.opacity = 0;

            setTimeout(() => {
                loading.style.display = "none";
            }, 1500);
        }, 1000);
    }

    document.getElementById("option_box1").addEventListener("click", function(event) {
        game_start_sound.play();
        event.preventDefault(); // ページ遷移を一時停止
        
        const url = this.parentElement.href; // ページのURLを取得
        const loading = document.getElementById("loading");
        loading.style.display = "block";
    
        loading_display().then(() => {
            window.location = url; // resolveが返されたらURLを変更してページを遷移
        });
    
        function loading_display() {
            return new Promise(async (resolve) => {
                setTimeout(() => {
                    loading.style.display = "block";
                    loading.style.backgroundColor = "#fff";
                    loading.style.zIndex = 50;
                    loading.style.opacity = 1;
        
                    setTimeout(() => {
                        loading.style.display = "none";
                        document.getElementById("ending_body").style.display = "none";
                        resolve();
                    }, 1500);
                }, 250);
            });
        }
    });
    
    document.getElementById("option_box2").addEventListener("click", function(event) {
        game_start_sound.play();
        event.preventDefault(); // ページ遷移を一時停止

        const url = this.parentElement.href; // ページのURLを取得
        const loading = document.getElementById("loading");
        loading.style.display = "block";
    
        loading_display().then(() => {
            window.location = url; // resolveが返されたらURLを変更してページを遷移
        });
    
        function loading_display() {
            return new Promise(async (resolve) => {
                setTimeout(() => {
                    loading.style.display = "block";
                    loading.style.backgroundColor = "#111";
                    loading.style.zIndex = 50;
                    loading.style.opacity = 1;
        
                    setTimeout(() => {
                        loading.style.display = "none";
                        document.getElementById("ending_body").style.display = "none";
                        resolve();
                    }, 1500);
                }, 250);
            });
        }
    });

    document.addEventListener("keydown", function(event) {
        if (event.key == "1") {
            ending_option(event.key);
        } else if (event.key == "2") {
            ending_option(event.key);
        }
    })
}

// エンディングの選択肢
function ending_option(num) {
    game_start_sound.play();
    let option_box1 = document.getElementById("option_box1");
    let option_box2 = document.getElementById("option_box2");

    if (num == 1) {
        option_box1.className = "option_box_animation"; // 選択肢のクラスをアニメーションの設定されているクラスに変更

        const url = "title.html"; // ページのURLを取得
        const loading = document.getElementById("loading");

        loading.style.display = "block";
        loading.style.backgroundColor = "#fff";
        
        loading_display().then(() => {
            window.location = url; // resolveが返されたらURLを変更してページを遷移
        });
        
        function loading_display() {
            return new Promise(async (resolve) => {
                setTimeout(() => {
                    loading.style.display = "block";
                    loading.style.zIndex = 50;
                    loading.style.opacity = 1;
        
                    setTimeout(() => {
                        loading.style.display = "none";
                        document.getElementById("ending_body").style.display = "none";
                        resolve();
                    }, 1500);
                }, 250);
            });
        }

    } else if (num == 2) {
        option_box2.className = "option_box_animation"; // 選択肢のクラスをアニメーションの設定されているクラスに変更

        const url = "end_roll.html"; // ページのURLを取得
        const loading = document.getElementById("loading");

        loading.style.display = "block";
        loading.style.backgroundColor = "#111";
        
        loading_display().then(() => {
            window.location = url; // resolveが返されたらURLを変更してページを遷移
        });
        
        function loading_display() {
            return new Promise(async (resolve) => {
                setTimeout(() => {
                    loading.style.display = "block";
                    loading.style.backgroundColor = "#111";
                    loading.style.zIndex = 50;
                    loading.style.opacity = 1;
        
                    setTimeout(() => {
                        loading.style.display = "none";
                        document.getElementById("ending_body").style.display = "none";
                        resolve();
                    }, 1500);
                }, 250);
            });
        }
    }

    setTimeout(() => {
        document.getElementById("option").style.display = "none"; // 選択肢を遅延して非表示
    }, 750);
}

function Enter_hidden() {
    game_start_sound.play();

    document.getElementById("Enter_hidden").style.display = "none";
    document.getElementById("player_name_input").style.display = "block";
    document.getElementById("name_button").style.display = "block";
}

function name_submit() {
    const name_input = document.getElementById("player_name_input").value;

    if (name_input == "") {
        alert("名無しさんはプレイできません！");
    } else {
        confirm(`あなたの名前は「${name_input}」です。よろしいですか？`);
        localStorage.setItem("player_name", name_input); // プレイヤー名をローカルストレージに保存(ページが遷移される際に変数が初期化されるため)

        const gender_option = document.getElementById("gender_option_box");

        gender_option.style.display = "block";
    }
}

// キャラクターを選択
function character_select(character_name) {
    confirm(character_name + "ルートを開始します。よろしいですか？");
    localStorage.setItem("character_name", character_name); // キャラクター名をローカルストレージに保存

    const url = "index.html"; // ページのURLを取得
    const loading = document.getElementById("loading");

    loading_display().then(() => {
        window.location = url; // resolveが返されたらURLを変更してページを遷移
    });

    function loading_display() {
        return new Promise(async (resolve) => {
            loading.style.zIndex = 50;
            loading.style.opacity = 1;

            setTimeout(() => {
                resolve(); // resolveを遅延して返す
            }, 1500);
        });
    }
}

function gender_select(num) {
    if (num == 1) {
        confirm("男の子でプレイします。よろしいですか？");
        localStorage.setItem("gender", "僕")
    } else {
        confirm("女の子でプレイします。よろしいですか？");
        localStorage.setItem("gender", "私");
    }

    document.getElementById("character_option_box").style.display = "flex";
    document.getElementById("gender_option_box").style.display = "none";
    document.getElementById("first_title").style.display = "none";
    document.getElementById("title_body").style.background = "#fff";
}

// テキストを分割
function text_division(passed_text_list) {
    let next_text = passed_text_list[0];
    document.getElementById("current_text").innerHTML = ""; // 現在のテキストを初期化

    text_list = []; // リストをリセット
    text_list = [...next_text]; // 新しいテキストを分割

    return text_list; // 分割したテキストを返す
}

// 次へボタンを押した時の処理
async function next_text() {
    let current_text = document.getElementById("current_text"); // 現在のテキストを取得

    if (text_display_flg == true) {
        let next_button = document.getElementById("next_button"); // 次へボタンを取得
        let name_tag_box = document.getElementById("name_tag"); // ネームタグを取得
        let text_list = [];

        text_skip_flg = false;
        text_display_flg = false;
        first_next_button_animation = false; // 関数が実行されたらアニメーションのリピートを停止

        next_text_sound.play(); // mp3ファイルを再生
        next_text_num += 1; // テキストのリスト番号を一つ進める

        if (next_text_num == 2) {

            if (root_list.Kitamura_root_flg) {
                un_direct_option_flg();

                name_tag_box.style.display = "none"; // ネームタグを非表示
                narration_flg = true;

                text_list = ["〜バンタン2階〜"];
                next_text_show();
            } else if (root_list.Hashidume_root_flg) {
                un_direct_option_flg();

                name_tag_box.style.display = "block";
                narration_flg = true;

                text_list = ["～バンタン2階～"];
                next_text_show();
            } else if (root_list.Komatsu_root_flg) {
                un_direct_option_flg();

                character_img.src = "../img/character/Komatsu/Komatsu_1.png";
                character_img.style.padding = "0";
                name_tag.textContent = character_name;
                text_list = ["にょっす！！"];

                next_text_show();
            } else if (root_list.Hukaya_root_flg) {
                un_direct_option_flg();

                character_img.src = "../img/character/Hashidume/Hashidume_1.png";
                character_img.style.padding = "0";

                name_tag_box.style.display = "block";
                name_tag.textContent = "ハシヅメ";
                nameless_flg = true;

                text_list = ["今日から一年間よろしくお願いします！"];
                next_text_show();
            } else if (root_list.Katura_root_flg) {
                un_direct_option_flg();

                name_tag_box.style.display = "block";
                name_tag.textContent = player_name;
                name_tag_flg = true;

                text_list = ["おはようございます！"];
                next_text_show();
            }
            
        } else if (next_text_num == 3) {

            if (root_list.Kitamura_root_flg) {
                un_direct_option_flg();
            
                name_tag_box.style.display = "block"; // ネームタグを表示

                text_list = ["おはようございます！初めまして！"];
                name_tag_flg = true
                next_text_show();
            } else if (root_list.Hashidume_root_flg) {
                un_direct_option_flg();

                name_tag_box.style.display = "block";
                name_tag_flg = true;

                text_list = ["おはようございます！初めまして！"];
                next_text_show();
            } else if (root_list.Komatsu_root_flg) {
                un_direct_option_flg();

                name_tag.textContent = player_name;
                name_tag_flg = true;

                text_list = ["今日からよろしくお願いします！いきなりなんですけど、コマツさんの授業見学しても良いですか？"];
                next_text_show();
            } else if (root_list.Hukaya_root_flg) {
                un_direct_option_flg();

                name_tag.textContent = player_name;
                name_tag_flg = true;

                text_list = ["こちらこそ、よろしくお願いします"];
                next_text_show();
            } else if (root_list.Katura_root_flg) {
                un_direct_option_flg();

                character_img.src = "../img/character/Katura/Katura_1.png";
                name_tag.textContent = character_name;
                text_list = [`おはようございます〜。新任スタッフの${player_name}さん?`];

                next_text_show();
            }
            
        } else if (next_text_num == 4) {

            if (root_list.Kitamura_root_flg) {
                un_direct_option_flg();

                name_tag.textContent = character_name;
                character_img.src = "../img/character/Kitamura/Kitamura_50%.png";
                character_img.style.padding = "0";

                text_list = ["おはやざっす。初めまして、今日からっすか？"];
                next_text_show();
            } else if (root_list.Hashidume_root_flg) {
                un_direct_option_flg();

                name_tag.textContent = character_name;
                character_img.src = "../img/character/Hashidume/Hashidume_1.png";
                character_img.style.padding = "0";

                text_list = [`おはようございます！！君が今日からスタッフとして一緒に働く${player_name}さんかな？よろしく！！`]
                next_text_show();
            } else if (root_list.Komatsu_root_flg) {
                un_direct_option_flg();

                name_tag.textContent = character_name;
                text_list = ["あー別に構わないですけど"];

                next_text_show();
            } else if (root_list.Hukaya_root_flg) {
                un_direct_option_flg();

                name_tag.textContent = "ハシヅメ";
                nameless_flg = true;

                text_list = ["早速ですが、504教室のフカヤ講師の授業に参加お願いします！"];
                next_text_show();
            } else if (root_list.Katura_root_flg) {
                un_direct_option_flg();

                name_tag.textContent = player_name;
                nameless_flg = true;

                text_list = [`はい！${player_name}です！`];
                next_text_show();
            }

        } else if(next_text_num == 5) {

            if (root_list.Kitamura_root_flg) {
                un_direct_option_flg();
                name_tag.textContent = player_name;

                text_list = ["はい！初めてなので授業見学させていただいてもよろしいでしょうか？"];
                name_tag_flg = true
                next_text_show();
            } else if (root_list.Hashidume_root_flg) {
                un_direct_option_flg();

                name_tag.textContent = player_name;
                name_tag_flg = true;
                text_list = ["あの、スタッフって何するか分からないので授業の見学をしたいのですが、よろしいでしょうか？"];
                next_text_show();
            } else if (root_list.Komatsu_root_flg) {
                un_direct_option_flg();

                character_img.src = "#";
                name_tag_box.style.display = "none";
                narration_flg = true;

                text_list = ["〜4階 402教室〜"];
                loading_flg = true;
                next_text_show();
                loading();

                loading().then(() => {
                    setTimeout(() => {
                        document.getElementById("loading").style.display = "none";
                        loading_flg = false;
                    }, 1500);
                });
            } else if (root_list.Hukaya_root_flg) {
                un_direct_option_flg();

                name_tag.textContent = player_name;
                name_tag_flg = true;

                text_list = ["分かりました"];
                next_text_show();
            } else if (root_list.Katura_root_flg) {
                un_direct_option_flg();

                name_tag.textContent = character_name;
                text_list = ["僕が今日ここを案内させていただく「カツラ」と申します"];

                next_text_show();
            }
            
        } else if(next_text_num == 6) {

            if (root_list.Kitamura_root_flg) {
                un_direct_option_flg();

                name_tag.textContent = character_name;
                text_list = ["あぁ、全然いいっすよ！"];
                next_text_show();
            } else if (root_list.Hashidume_root_flg) {
                un_direct_option_flg();

                name_tag.textContent = character_name;
                text_list = ["ん〜そうだね、多分緊張もしてるだろうからリラックスも兼ねて僕と一緒に見て回ろうか"];
                next_text_show();
            } else if (root_list.Komatsu_root_flg) {
                un_direct_option_flg();

                character_img.src = "../img/character/Komatsu/Komatsu_4.png";
                name_tag_box.style.display = "block";
                name_tag.textContent = character_name;

                text_list = ["これちゃんと写してね！これ今のうちにやっとかないとガチで次詰むからね！！"];
                next_text_show();
            } else if (root_list.Hukaya_root_flg) {
                un_direct_option_flg();

                character_img.src = "#";
                name_tag_box.style.display = "none";
                narration_flg = true;

                text_list = ["〜5階 504教室〜"];
                loading_flg = true;
                next_text_show();
                loading();

                loading().then(() => {
                    setTimeout(() => {
                        document.getElementById("loading").style.display = "none";
                        loading_flg = false;
                    }, 1500);
                });
            } else if (root_list.Katura_root_flg) {
                un_direct_option_flg();

                name_tag.textContent = player_name;
                name_tag_flg = true;

                text_list = ["今日はよろしくお願いします！"];
                next_text_show();
            }

        } else if (next_text_num == 7) {

            if (root_list.Kitamura_root_flg) {
                un_direct_option_flg();
                
                character_img.src = "#";
                name_tag_box.style.display = "none";
                narration_flg = true;

                text_list = ["〜5階 503教室〜"];
                loading_flg = true;
                next_text_show();
                loading();

                loading().then(() => {
                    setTimeout(() => {
                        document.getElementById("loading").style.display = "none";
                        loading_flg = false;
                    }, 1500);
                });
            } else if (root_list.Hashidume_root_flg) {
                un_direct_option_flg();

                name_tag.textContent = player_name;
                name_tag_flg = true;
                text_list = ["良いんですか！ありがとうございます！"];

                next_text_show();
            } else if (root_list.Komatsu_root_flg) {
                un_direct_option_flg();

                name_tag.textContent = player_name;
                name_tag_flg = true;

                text_list = ["この先生はこんな感じなんだ〜"];
                next_text_show();
            } else if (root_list.Hukaya_root_flg) {
                un_direct_option_flg();

                character_img.src = "../img/character/Hukaya/Hukaya_1.png";
                name_tag.textContent = character_name;
                name_tag_box.style.display = "block";

                text_list = ["ITパスポート試験対策講座の担当講師・フカヤです。よろしくお願いします！"];
                next_text_show();
            } else if (root_list.Katura_root_flg) {
                un_direct_option_flg();

                name_tag.textContent = character_name;
                text_list = ["申し訳ないんですけど、実は急遽ガイダンスが入ってしまって。"];

                next_text_show();
            }

        } else if (next_text_num == 8) {

            if (root_list.Kitamura_root_flg) {
                un_direct_option_flg();

                character_img.src = "../img/character/Kitamura/Kitamura_4.png";
                character_img.style.padding = "50px 0 0 0";
                name_tag_box.style.display = "block";

                text_list = ["うぇ！？マジッすか！？んなことあったんすか！マジそれやばくねぇー！？"];
                next_text_show();
            } else if (root_list.Hashidume_root_flg) {
                un_direct_option_flg();

                name_tag.textContent = character_name;
                text_list = ["それじゃあ行こっか"];
                next_text_show();
            } else if (root_list.Komatsu_root_flg) {
                un_direct_option_flg();

                character_img.src = "#";
                name_tag_box.style.display = "none";
                narration_flg = true;

                text_list = ["〜授業後〜"];
                loading_flg = true;
                next_text_show();
                loading();

                loading().then(() => {
                    setTimeout(() => {
                        document.getElementById("loading").style.display = "none";
                        loading_flg = false;
                    }, 1500);
                });
            } else if (root_list.Hukaya_root_flg) {
                un_direct_option_flg();

                name_tag.textContent = player_name;
                name_tag_flg = true;

                text_list = [`今日から一年間お世話になります、${player_name}と言います。よろしくお願いします`];
                next_text_show();
            } else if (root_list.Katura_root_flg) {
                un_direct_option_flg();

                text_list = ["せっかくなので見て行きますか？"];
                next_text_show();
            }

        } else if (next_text_num == 9) {

            if (root_list.Kitamura_root_flg) {
                un_direct_option_flg();

                name_tag.textContent = "生徒A";
                nameless_flg = true;
                
                text_list = ["そうなんすよ！"];
                next_text_show();
            } else if (root_list.Hashidume_root_flg) {
                un_direct_option_flg();

                character_img.src = "#";
                name_tag_box.style.display = "none";
                narration_flg = true;

                text_list = ["～4階 402教室～"];
                loading_flg = true;
                next_text_show();
                loading();

                loading().then(() => {
                    setTimeout(() => {
                        document.getElementById("loading").style.display = "none";
                        loading_flg = false;
                    }, 1500);
                });
            } else if (root_list.Komatsu_root_flg) {
                un_direct_option_flg();

                name_tag_box.style.display = "block";
                name_tag.textContent = player_name;
                name_tag_flg = true;

                text_list = ["授業お疲れ様でした"];
                next_text_show();
            } else if (root_list.Hukaya_root_flg) {
                un_direct_option_flg();

                name_tag_flg = true;
                text_list = ["早速一つ質問なんですけど、ITパスポートってどういうものなんですか？"];

                next_text_show();
            } else if (root_list.Katura_root_flg) {
                un_direct_option_flg();

                name_tag.textContent = player_name;
                name_tag_flg = true;

                text_list = ["はい！ガイダンスの方見学させて頂きたいです！"];
                next_text_show();
            }

        } else if (next_text_num == 10) {

            if (root_list.Kitamura_root_flg) {
                un_direct_option_flg();
                name_tag.textContent = player_name;

                text_list = ["この先生はこんな感じなのか〜"];
                name_tag_flg = true
                next_text_show();
            } else if (root_list.Hashidume_root_flg) {
                un_direct_option_flg();

                name_tag_box.style.display = "block";
                name_tag.textContent = "コマツ";
                nameless_flg = true;

                text_list = ["この問題の答えは～…"];
                next_text_show();
            } else if (root_list.Komatsu_root_flg) {
                un_direct_option_flg();

                character_img.src = "../img/character/Komatsu/Komatsu_1.png";
                name_tag.textContent = character_name;
                
                text_list = ["お疲れ様でした、どうでした僕の授業は？"];
                next_text_show();
            } else if (root_list.Hukaya_root_flg) {
                un_direct_option_flg();

                name_tag.textContent = character_name;
                text_list = ["ITパスポートはですね、ITの基礎分野を詰め込んだ資格です。"];

                next_text_show();
            } else if (root_list.Katura_root_flg) {
                un_direct_option_flg();

                name_tag.textContent = character_name;
                text_list = ["了解です。では4階に向かいましょうか。"];

                next_text_show();
            }

        } else if (next_text_num == 11) {
            
            if (root_list.Kitamura_root_flg) {
                un_direct_option_flg();

                character_img.src = "#";
                name_tag_box.style.display = "none";
                narration_flg = true;

                text_list = ["〜授業後〜"];
                loading_flg = true;
                next_text_show();
                loading();

                loading().then(() => {
                    setTimeout(() => {
                        document.getElementById("loading").style.display = "none";
                    }, 1500);
                    loading_flg = false;
                });
            } else if (root_list.Hashidume_root_flg) {
                un_direct_option_flg();

                name_tag.textContent = "生徒達";
                nameless_flg = true;

                text_list = ["がやがや"];
                next_text_show();
            } else if (root_list.Komatsu_root_flg) {
                un_direct_option_flg();

                name_tag.textContent = player_name;
                name_tag_flg = true;

                text_list = ["話が分かりやすくって面白かったです！"];
                next_text_show();
            } else if (root_list.Hukaya_root_flg) {
                un_direct_option_flg();

                text_list = [`この授業では、資格を取得するための勉強方法や、実際の試験での進め方をサポートしていきます。`];
                next_text_show();
            } else if (root_list.Katura_root_flg) {
                un_direct_option_flg();

                character_img.src = "#";
                name_tag_box.style.display = "none";
                narration_flg = true;

                text_list = ["〜4階 403教室〜"];
                loading_flg = true;
                next_text_show();
                loading();

                loading().then(() => {
                    setTimeout(() => {
                        document.getElementById("loading").style.display = "none";
                    }, 1500);
                    loading_flg = false;
                });
            }

        } else if (next_text_num == 12) {

            if (root_list.Kitamura_root_flg) {
                un_direct_option_flg();

                name_tag_box.style.display = "block";
                name_tag.textContent = player_name;

                text_list = ["授業お疲れ様でした"];
                name_tag_flg = true
                next_text_show();
            } else if (root_list.Hashidume_root_flg) {
                un_direct_option_flg();

                name_tag.textContent = player_name;
                name_tag_flg = true;

                text_list = ["わぁ～すごい！本格的な授業ですね！"];
                next_text_show();
            } else if (root_list.Komatsu_root_flg) {
                un_direct_option_flg();

                name_tag.textContent = character_name;
                text_list = ["あ〜ならよかったです（照///）"];

                next_text_show();
            } else if (root_list.Hukaya_root_flg) {
                un_direct_option_flg();

                name_tag.textContent = player_name;
                name_tag_flg = true;

                text_list = ["なるほど〜"];
                next_text_show();
            } else if (root_list.Katura_root_flg) {
                un_direct_option_flg();

                character_img.src = "../img/character/Katura/Katura_1.png";
                name_tag_box.style.display = "block";
                name_tag.textContent = character_name;

                text_list = ["着きました。ガイダンスは403教室で行いますので"];
                next_text_show();
            }

        } else if (next_text_num == 13) {

            if (root_list.Kitamura_root_flg) {
                un_direct_option_flg();

                character_img.src = "../img/character/Kitamura/Kitamura_50%.png";
                character_img.style.padding = "0";
                name_tag.textContent = character_name;

                text_list = ["お疲れっす、どうでしたか僕の授業は？"];
                next_text_show();
            } else if (root_list.Hashidume_root_flg) {
                un_direct_option_flg();

                character_img.src = "../img/character/Hashidume/Hashidume_1.png";
                name_tag.textContent = character_name;

                text_list = ["僕たちの仕事は授業スケジュールを組んだり、生徒たちのサポートをするんだよ"];
                next_text_show();
            } else if (root_list.Komatsu_root_flg) {
                un_direct_option_flg();

                name_tag.textContent = player_name;
                name_tag_flg = true;

                text_list = ["そういえば三ヶ月後クリスマスですね！！"];
                next_text_show();
            } else if (root_list.Hukaya_root_flg) {
                un_direct_option_flg();

                character_img.src = "#";
                name_tag_box.style.display = "none";
                narration_flg = true;

                text_list = ["〜授業後〜"];
                loading_flg = true;
                next_text_show();
                loading();

                loading().then(() => {
                    setTimeout(() => {
                        document.getElementById("loading").style.display = "none";
                    }, 1500);
                    loading_flg = false;
                });
            } else if (root_list.Katura_root_flg) {
                un_direct_option_flg();

                character_img.src = "../img/character/Hashidume/Hashidume_3.png";
                name_tag.textContent = "ハシヅメ";
                nameless_flg = true;

                text_list = ["あ、きたきた。カツラさん出席確認はしといたんで、後よろしくお願いします。"];
                next_text_show();
            }

        } else if (next_text_num == 14) {

            if (root_list.Kitamura_root_flg) {
                un_direct_option_flg();
                name_tag.textContent = player_name;

                text_list = ["話が分かりやすくって面白かったです！"];
                name_tag_flg = true;
                next_text_show();
            } else if (root_list.Hashidume_root_flg) {
                un_direct_option_flg();

                name_tag.textContent = player_name;
                name_tag_flg = true;

                text_list = ["生徒たちのサポート？"];
                next_text_show();
            } else if (root_list.Komatsu_root_flg) {
                un_direct_option_flg();

                name_tag.textContent = character_name;
                text_list = ["あ〜もうそんな時期かあ"];

                next_text_show();
            } else if (root_list.Hukaya_root_flg) {
                un_direct_option_flg();

                character_img.src = "../img/character/Hukaya/Hukaya_1.png";
                name_tag_box.style.display = "block";
                name_tag.textContent = character_name;

                text_list = ["今日の授業はどうでしたか？"];
                next_text_show();
            } else if (root_list.Katura_root_flg) {
                un_direct_option_flg();

                character_img.src = "../img/character/Katura/Katura_2.png";
                name_tag.textContent = character_name;

                text_list = ["あれ、面白い事するって言ってませんでした?笑"];
                next_text_show();
            }

        } else if (next_text_num == 15) {

            if (root_list.Kitamura_root_flg) {
                un_direct_option_flg();

                name_tag.textContent = character_name;
                text_list = ["本当っすか！それなら良かったっす（照//）"];
                next_text_show();
            } else if (root_list.Hashidume_root_flg) {
                un_direct_option_flg();

                character_img.src = "../img/character/Hashidume/Hashidume_1.png";
                name_tag.textContent = character_name;

                text_list = ["そうそう、まぁ元気付けたり、相談に乗ってあげないといけないからね。僕みたいに元気よく接するのもいいよ！"];
                next_text_show();
            } else if (root_list.Komatsu_root_flg) {
                un_direct_option_flg();

                name_tag.textContent = player_name;
                name_tag_flg = true;

                text_list = ["クリスマス楽しみですね！"];
                next_text_show();
            } else if (root_list.Hukaya_root_flg) {
                un_direct_option_flg();

                name_tag.textContent = player_name;
                name_tag_flg = true;

                text_list = ["教科書に沿って問題の解き方を教えてくれて、とても分かりやすくて楽しい授業でした"];
                next_text_show();
            } else if (root_list.Katura_root_flg) {
                un_direct_option_flg();

                character_img.src = "../img/character/Hashidume/Hashidume_1.png";
                name_tag.textContent = "ハシヅメ";
                nameless_flg = true;

                text_list = ["いやいや言ってませんよ笑"];
                next_text_show();
            }

        } else if (next_text_num == 16) {

            if (root_list.Kitamura_root_flg) {
                un_direct_option_flg();
                name_tag.textContent = player_name;

                text_list = ["今日はありがとうございました"];
                name_tag_flg = true;
                next_text_show();
            } else if (root_list.Hashidume_root_flg) {
                un_direct_option_flg();

                name_tag.textContent = player_name;
                name_tag_flg = true;

                text_list = ["（橋爪さんって親切で元気があるなぁ）"];
                next_text_show();
            } else if (root_list.Komatsu_root_flg) {
                un_direct_option_flg();

                name_tag.textContent = character_name;
                text_list = ["そうですね〜"];

                next_text_show();
            } else if (root_list.Hukaya_root_flg) {
                un_direct_option_flg();

                name_tag.textContent = character_name;
                text_list = ["そこまで言って頂いて…ありがとうございます"];

                next_text_show();
            } else if (root_list.Katura_root_flg) {
                un_direct_option_flg();

                name_tag.textContent = "メンバー";
                nameless_flg = true;

                text_list = ["カツラさん来てからやるって言ってましたよ〜！"];
                next_text_show();
            }

        } else if (next_text_num == 17) {

            if (root_list.Kitamura_root_flg) {
                un_direct_option_flg();

                name_tag.textContent = character_name;
                text_list = ["またなんかあればいつでも言ってください！"];
                next_text_show();
            } else if (root_list.Hashidume_root_flg) {
                un_direct_option_flg();

                character_img.src = "#";
                name_tag_box.style.display = "none";
                narration_flg = true;
                loading_flg = true;

                text_list = ["～見学が終わり～"];
                next_text_show();

                loading();
                loading().then(() => {
                    setTimeout(() => {
                        document.getElementById("loading").style.display = "none";
                    }, 1500);
                    loading_flg = false;
                });
            } else if (root_list.Komatsu_root_flg) {
                un_direct_option_flg();

                character_img.src = "#";
                name_tag_box.style.display = "none";
                narration_flg = true;
                loading_flg = true;

                text_list = ["～3ヶ月後～"];
                next_text_show();
                log_remove();

                loading();
                loading().then(() => {
                    setTimeout(() => {
                        document.getElementById("loading").style.display = "none";
                    }, 1500);
                    loading_flg = false;
                });
            } else if (root_list.Hukaya_root_flg) {
                un_direct_option_flg();

                name_tag.textContent = player_name;
                name_tag_flg = true;
                text_list = ["また来週もお願いします"];

                next_text_show();
            } else if (root_list.Katura_root_flg) {
                un_direct_option_flg();

                name_tag.textContent = "ハシヅメ";
                nameless_flg = true;

                text_list = ["おいおいおい笑するって言ってないから笑"];
                next_text_show();
            }

        } else if (next_text_num == 18) {

            if (root_list.Kitamura_root_flg) {
                un_direct_option_flg();
                name_tag.textContent = player_name;

                text_list = ["はい！"];
                name_tag_flg = true;
                next_text_show();
            } else if (root_list.Hashidume_root_flg) {
                un_direct_option_flg();

                name_tag_box.style.display = "block";
                name_tag.textContent = player_name;
                name_tag_flg = true;

                text_list = ["橋爪さん！今日はありがとうございました！"];
                next_text_show();
            } else if (root_list.Komatsu_root_flg) {
                un_direct_option_flg();

                character_img.src = "../img/character/Komatsu/Komatsu_1.png";
                name_tag_box.style.display = "block";
                name_tag.textContent = character_name;

                text_list = ["おはようございます〜"];
                next_text_show();
            } else if (root_list.Hukaya_root_flg) {
                un_direct_option_flg();

                character_img.src = "#";
                name_tag_box.style.display = "none";
                narration_flg = true;

                loading();
                log_remove();
                loading_flg = true;

                text_list = ["〜半年後〜"];
                next_text_show();

                loading().then(() => {
                    setTimeout(() => {
                        document.getElementById("loading").style.display = "none";
                    }, 1500);
                    loading_flg = false;
                });
            } else if (root_list.Katura_root_flg) {
                un_direct_option_flg();

                character_img.src = "../img/character/Katura/Katura_1.png";
                name_tag.textContent = character_name;

                text_list = ["じゃあ前…よろしくお願いします^^"];
                next_text_show();
            }

        } else if (next_text_num == 19) {

            if (root_list.Kitamura_root_flg) {
                un_direct_option_flg();

                character_img.src = "#";
                name_tag_box.style.display = "none";
                narration_flg = true;

                loading();
                log_remove();
                loading_flg = true;

                text_list = ["〜3ヶ月後〜"];
                next_text_show();

                loading().then(() => {
                    setTimeout(() => {
                        document.getElementById("loading").style.display = "none";
                    }, 1500);
                    loading_flg = false;
                });
            } else if (root_list.Hashidume_root_flg) {
                un_direct_option_flg();

                character_img.src = "../img/character/Hashidume/Hashidume_1.png";
                name_tag.textContent = character_name;

                text_list = ["いやいや良いんだよ、これからよろしくね！！"];
                next_text_show();
            } else if (root_list.Komatsu_root_flg) {
                un_direct_option_flg();

                name_tag.textContent = player_name;
                name_tag_flg = true;

                text_list = ["おはようございます！"];
                next_text_show();
            } else if (root_list.Hukaya_root_flg) {
                un_direct_option_flg();

                character_img.src = "../img/character/Hukaya/Hukaya_1.png";
                name_tag.textContent = character_name;
                name_tag_box.style.display = "block";

                text_list = ["今日もありがとうございました"];
                next_text_show();
            } else if (root_list.Katura_root_flg) {
                un_direct_option_flg();

                character_img.src = "#";
                name_tag_box.style.display = "none";
                narration_flg = true;

                loading();
                loading_flg = true;

                text_list = ["〜ガイダンスの終盤〜"];
                next_text_show();

                loading().then(() => {
                    setTimeout(() => {
                        document.getElementById("loading").style.display = "none";
                    }, 1500);
                    loading_flg = false;
                });
            }
            
        } else if (next_text_num == 20) {

            if (root_list.Kitamura_root_flg) {
                un_direct_option_flg();

                character_img.src = "../img/character/Kitamura/Kitamura_50%.png";
                name_tag_box.style.display = "block";
                name_tag.textContent = character_name;

                text_list = ["うっす、おはようございます！"];
                next_text_show();
            } else if (root_list.Hashidume_root_flg) {
                un_direct_option_flg();

                name_tag.textContent = player_name;
                name_tag_flg = true;

                text_list = ["！！"];
                next_text_show();
            } else if (root_list.Komatsu_root_flg) {
                un_direct_option_flg();

                name_tag_flg = true;
                text_list = ["（出会って3ヶ月、最近気づいたらコマツさんのことばかり見てしまう、私どうしちゃったんだろう///）"];

                next_text_show();
            } else if (root_list.Hukaya_root_flg) {
                un_direct_option_flg();

                name_tag.textContent = player_name;
                name_tag_flg = true;

                text_list = ["ありがとうございました！"];
                next_text_show();
            } else if (root_list.Katura_root_flg) {
                un_direct_option_flg();

                name_tag_box.style.display = "block";
                name_tag.textContent = player_name;
                name_tag_flg = true;

                text_list = ["(凄いなぁ…カツラさんメンバーに寄り添いながらも、しっかりするところはしっかりしてる…)"];
                next_text_show();
            }

        } else if (next_text_num == 21) {

            if (root_list.Kitamura_root_flg) {
                un_direct_option_flg();

                name_tag.textContent = player_name;

                text_list = ["おはようございます！"];
                name_tag_flg = true;
                next_text_show();
            } else if (root_list.Hashidume_root_flg) {
                un_direct_option_flg();

                name_tag_flg = true;
                text_list = ["はいっ”！（声が裏返る）"];
                next_text_show();
            } else if (root_list.Komatsu_root_flg) {
                un_direct_option_flg();

                name_tag.textContent = character_name;
                option_flg = true;

                let option_text = "…何かありました？";
                let option1 = "はっ！すみません何でもありません！";
                let option2 = "最近気づいたらコマツさんのことを見てしまっているんです//";
                let option1_text = "(どうしたんだろう…？)";
                let option2_text = "突然何言ってるの、シャキッとしてほら（照///）";

                delivery_text_list = [option1_text, option2_text];
                option_display(option_text, option1, option2);
            } else if (root_list.Hukaya_root_flg) {
                un_direct_option_flg();

                name_tag_flg = true;
                text_list = ["あの、もしよろしければ今度一緒にお出かけしませんか？"];

                next_text_show();
            } else if (root_list.Katura_root_flg) {
                un_direct_option_flg();

                name_tag_flg = true;
                text_list = [`(${first_person}も見習わなくちゃ！)`];

                next_text_show();
            }

        } else if (next_text_num == 22) {

            if (root_list.Kitamura_root_flg) {
                un_direct_option_flg();

                text_list = ["（バンタンに来て3ヶ月…）"];
                name_tag_flg = true;
                next_text_show();
            } else if (root_list.Hashidume_root_flg) {
                un_direct_option_flg();

                character_img.src = "../img/character/Hashidume/Hashidume_1.png";
                name_tag.textContent = character_name;

                text_list = ["まぁだ緊張してるの？笑"];
                next_text_show();
            } else if (root_list.Hukaya_root_flg) {
                un_direct_option_flg();

                name_tag.textContent = character_name;
                text_list = ["良いですね。どこに行きますか？"];

                next_text_show();
            } else if (root_list.Katura_root_flg) {
                un_direct_option_flg();

                character_img.src = "../img/character/Katura/Katura_1.png";
                name_tag.textContent = character_name;
                text_list = [`${player_name}さん、メンバーの皆にアドバイス的なことってあります？`];

                next_text_show();
            }

        } else if (next_text_num == 23) {

            if (root_list.Kitamura_root_flg) {
                un_direct_option_flg();

                text_list = ["（気付いたらキタムラさんのことばかり見てしまう…）"];
                name_tag_flg = true;
                next_text_show();
            } else if (root_list.Hashidume_root_flg) {
                un_direct_option_flg();

                name_tag.textContent = player_name;
                name_tag_flg = true;

                text_list = ["（恥ずかしい…//）"];
                next_text_show();
            } else if (root_list.Komatsu_root_flg) {
                un_direct_option_flg();

                name_tag.textContent = player_name;
                name_tag_flg = true;
                option1_flg = false;
                option2_flg = false;

                text_list = [`そういえば${first_person}、クリスマスマーケット行ってみたいんですよね！`];
                next_text_show();
            } else if (root_list.Hukaya_root_flg) {
                un_direct_option_flg();

                name_tag.textContent = player_name;
                name_tag_flg = true;

                text_list = ["この前友達に紹介された海鮮のお店があるんですが、よければ行きませんか？"];
                next_text_show();
            } else if (root_list.Katura_root_flg) {
                un_direct_option_flg();

                name_tag.textContent = player_name;
                name_tag_flg = true;

                text_list = [`あ、${first_person}ですか？`];
                next_text_show();
            }

        } else if (next_text_num == 24) {

            if (root_list.Kitamura_root_flg) {
                un_direct_option_flg();

                text_list = ["（私、どうしちゃったんだろう…//）"]
                name_tag_flg = true;
                next_text_show();
            } else if (root_list.Hashidume_root_flg) {
                un_direct_option_flg();

                text_list = ["これからよろしくお願いします…//"];
                next_text_show();
            } else if (root_list.Komatsu_root_flg) {
                un_direct_option_flg();

                name_tag.textContent = character_name;
                option_flg = true;

                let option_text = "へ〜そんなのやってるんだ";
                let option1 = "今日学校終わった後って何か予定ありますか？";
                let option2 = "今日この後なんかある？";
                let option1_text = "特にないですよ";
                let option2_text = "特にないですよ";

                delivery_text_list = [option1_text, option2_text];
                option_display(option_text, option1, option2);
            } else if (root_list.Hukaya_root_flg) {
                un_direct_option_flg();

                name_tag.textContent = character_name;
                text_list = ["ぜひ行きましょう！"];

                next_text_show();
            } else if (root_list.Katura_root_flg) {
                un_direct_option_flg();

                name_tag_flg = true;
                text_list = ["それじゃあ…"];

                next_text_show();
            }

        } else if (next_text_num == 25) {

            if (root_list.Kitamura_root_flg) {
                un_direct_option_flg();

                let option_text = "どうしたんすか？何か考え事でも？";
                let option1 = "はっ！すみません何でもありません！！";
                let option2 = "最近気づいたらキタムラさんのことを見てしまっているんです//";
                let option1_text = "（どうしたんだろう…？）";
                let option2_text = "どうしたんすか突然！恥ずかしいじゃないっすか//";

                delivery_text_list = [option1_text, option2_text];

                name_tag.textContent = character_name;
                option_flg = true;

                option_display(option_text, option1, option2);
            } else if (root_list.Hashidume_root_flg) {
                un_direct_option_flg();

                name_tag.textContent = character_name;
                loading_flg = true;

                text_list = ["おはようございまーす！"];
                next_text_show();
                loading();
                log_remove();

                loading().then(() => {
                    setTimeout(() => {
                        document.getElementById("loading").style.display = "none";
                    }, 1500);
                    character_img.src = "../img/character/Hashidume/Hashidume_2.png";
                    character_img.style.padding = "100px 0 0 0";
                    loading_flg = false;
                });
            } else if (root_list.Hukaya_root_flg) {
                un_direct_option_flg();
                
                character_img.src = "#";
                name_tag_box.style.display = "none";
                narration_flg = true;

                loading();
                loading_flg = true;

                text_list = ["〜店内にて〜"];
                next_text_show();

                loading().then(() => {
                    setTimeout(() => {
                        document.getElementById("loading").style.display = "none";
                    }, 1500);
                    loading_flg = false;
                });
            } else if (root_list.Katura_root_flg) {
                un_direct_option_flg();

                character_img.src = "#";
                name_tag_flg = true;
                text_list = [`メンバーの皆さん！初めまして、ここの新任スタッフになった${player_name}です！`];

                next_text_show();
            }

        } else if (next_text_num == 26) {

            if (root_list.Hashidume_root_flg) {
                un_direct_option_flg();

                name_tag.textContent = player_name;
                name_tag_flg = true;

                text_list = ["お、おはようございます！！"];
                next_text_show();
            } else if (root_list.Komatsu_root_flg) {
                un_direct_option_flg();

                name_tag.textContent = player_name;
                name_tag_flg = true;
                option1_flg = false;
                option2_flg = false;

                text_list = ["本当ですか！良かったらどこか一緒に行きませんか？"];
                next_text_show();
            } else if (root_list.Hukaya_root_flg) {
                un_direct_option_flg();

                name_tag_box.style.display = "block";
                name_tag.textContent = player_name;
                name_tag_flg = true;

                text_list = ["深谷さんは何食べますか？"];
                next_text_show();
            } else if (root_list.Katura_root_flg) {
                un_direct_option_flg();

                name_tag_flg = true;
                text_list = ["あなた達はいずれ、選択を問われる時が来ると思います"];

                next_text_show();
            }

        } else if (next_text_num == 27) {

            if (root_list.Kitamura_root_flg) {
                let option_text = "テキスト";
                let option1 = "今日学校終わった後って何か予定ありますか？";
                let option2 = "今日この後なんかある？";
                let option1_text = "特にないっすよ";
                let option2_text = "特にないっすよ";

                delivery_text_list = [option1_text, option2_text];

                option_flg = true;
                direct_option_flg = true;
                option1_flg = false;
                option2_flg = false;

                option_display(option_text, option1, option2);
            } else if (root_list.Hashidume_root_flg) {
                un_direct_option_flg();

                text_list = ["（や、やばい…！）"];
                name_tag_flg = true;

                next_text_show();
            } else if (root_list.Komatsu_root_flg) {
                un_direct_option_flg();

                name_tag.textContent = character_name;
                text_list = ["まぁ…良いですけど"];

                next_text_show();
            } else if (root_list.Hukaya_root_flg) {
                un_direct_option_flg();

                character_img.src = "../img/character/Hukaya/Hukaya_1.png";
                name_tag.textContent = character_name;
                option_flg = true;

                let option_text = `マグロ丼にしようかな。${player_name}さんはどうしますか？`;
                let option1 = "ネギトロ丼にします";
                let option2 = "タコの踊り食いで";
                let option1_text = "ネギトロ丼も良いな〜シェアしましょうよ！";
                let option2_text = "踊り食い…ですか";

                delivery_text_list = [option1_text, option2_text];
                option_display(option_text, option1, option2);
            } else if (root_list.Katura_root_flg) {
                un_direct_option_flg();

                name_tag_flg = true;
                text_list = [`その選択で後悔しそうなことを選ぶなら、大きい事を選択して挑戦した方が良いと${first_person}は思います`];

                next_text_show();
            }
            
        } else if (next_text_num == 28) {

            if (root_list.Hashidume_root_flg) {
                un_direct_option_flg();

                name_tag.textContent = character_name;
                text_list = [`${player_name}さん、どうしたんですか？`];

                next_text_show();
            } else if (root_list.Komatsu_root_flg) {
                un_direct_option_flg();

                option_flg = true;
                loading_flg = true;

                loading();
                log_remove();

                loading().then(() => {
                    setTimeout(() => {
                        document.getElementById("loading").style.display = "none";
                    }, 1500);
                    loading_flg = false;

                    let option_text = "で、どこ行くんですか？";
                    let option1 = "それなら…クリスマスマーケットに行きませんか？";
                    let option2 = "じゃあ…ジャスコに行きませんか？";
                    let option1_text = "あぁ朝言ってたやつですか、良いですよ";
                    let option2_text = "ジャスコ伊丹店いきますか";

                    delivery_text_list = [option1_text, option2_text];
                    option_display(option_text, option1, option2);
                });
            } else if (root_list.Katura_root_flg) {
                un_direct_option_flg();

                name_tag_flg = true;
                text_list = ["例えそれで〜〜……"];

                next_text_show();
            }

        } else if (next_text_num == 29) {

            if (root_list.Kitamura_root_flg) {
                un_direct_option_flg();

                name_tag.textContent = player_name;
                text_list = ["本当ですか！良かったらどこか一緒に行きませんか？"];
                name_tag_flg = true;
                option1_flg = false;
                option2_flg = false;

                next_text_show();
            } else if (root_list.Hashidume_root_flg) {
                un_direct_option_flg();

                name_tag.textContent = player_name;
                name_tag_flg = true;

                text_list = ["ひゃぁぇ！！"];
                next_text_show();
            } else if (root_list.Hukaya_root_flg) {
                un_direct_option_flg();

                character_img.src = "#";
                name_tag_box.style.display = "none";

                text_list = ["〜食事の後〜"];
                narration_flg = true;
                loading_flg = true;
                option1_flg = false;
                option2_flg = false;

                loading();
                next_text_show();

                loading().then(() => {
                    setTimeout(() => {
                        document.getElementById("loading").style.display = "none";
                    }, 1500);
                    loading_flg = false;
                });
            } else if (root_list.Katura_root_flg) {
                un_direct_option_flg();

                character_img.src = "#";
                name_tag_box.style.display = "none";
                narration_flg = true;

                loading();
                loading_flg = true;

                text_list = ["〜話が終わり〜"];
                next_text_show();

                loading().then(() => {
                    setTimeout(() => {
                        document.getElementById("loading").style.display = "none";
                    }, 1500);
                    loading_flg = false;
                });
            }

        } else if (next_text_num == 30) {

            if (root_list.Kitamura_root_flg) {
                un_direct_option_flg();

                name_tag.textContent = character_name;
                text_list = ["全然いいっすよ！行きましょうか！"];
                next_text_show(); 
            } else if (root_list.Hashidume_root_flg) {
                un_direct_option_flg();

                name_tag.textContent = character_name;
                text_list = ["！？"];

                next_text_show();
            } else if (root_list.Komatsu_root_flg) {
                un_direct_option_flg();

                character_img.src = "#";
                loading_flg = true;

                name_tag.textContent = player_name;
                name_tag_flg = true;
                option1_flg = false;
                option2_flg = false;

                text_list = ["やっぱクリスマスだから色々イルミネーションとか装飾されてて綺麗でしたね！"];
                next_text_show();

                loading();
                loading().then(() => {
                    setTimeout(() => {
                        document.getElementById("loading").style.display = "none";
                    }, 1500);
                    loading_flg = false;
                });
            } else if (root_list.Hukaya_root_flg) {
                un_direct_option_flg();

                name_tag_box.style.display = "block";
                name_tag.textContent = player_name;
                name_tag_flg = true;
                
                text_list = ["ご飯どうでしたか？"];
                next_text_show();
            } else if (root_list.Katura_root_flg) {
                un_direct_option_flg();

                name_tag_box.style.display = "block";
                name_tag.textContent = player_name;
                name_tag_flg = true;

                text_list = ["ご清聴ありがとうございました"];
                next_text_show();
            }

        } else if (next_text_num == 31) {

            if (root_list.Kitamura_root_flg) {
                un_direct_option_flg();

                let option_text = "それじゃ早速っすけど、どこ行きます？";
                let option1 = "実は気になってるレストランがあって、そことかどうですか？";
                let option2 = "近くに二郎系ラーメンのお店があるんですけど、どうですか？";
                let option1_text = "レストランですか！いいっすね！";
                let option2_text = "二郎かあ〜（にんにくキツそうだな…大丈夫かな）";

                delivery_text_list = [option1_text, option2_text];

                name_tag.textContent = character_name;
                option_flg = true;
                loading_flg = true;

                option_display(option_text, option1, option2);
            } else if (root_list.Hashidume_root_flg) {
                un_direct_option_flg();

                text_list = ["驚かしちゃいましたか！？ごめんなさい！"];
                next_text_show();
            } else if (root_list.Komatsu_root_flg) {
                un_direct_option_flg();

                character_img.src = "../img/character/Komatsu/Komatsu_1.png";
                name_tag.textContent = character_name;
                text_list = ["ですね、でもあなたの方がPython3のコードのように綺麗だよ"];

                next_text_show();
            } else if (root_list.Hukaya_root_flg) {
                un_direct_option_flg();

                character_img.src = "../img/character/Hukaya/Hukaya_1.png";
                name_tag.textContent = character_name;
                text_list = ["とても美味しかったですよ"];

                next_text_show();
            } else if (root_list.Katura_root_flg) {
                un_direct_option_flg();

                character_img.src = "../img/character/Katura/Katura_1.png";
                name_tag.textContent = character_name;

                text_list = ["ありがとうございました。とてもいい事を言ってくださいましたね"];
                next_text_show();
            }

        } else if (next_text_num == 32) {

            if (root_list.Hashidume_root_flg) {
                un_direct_option_flg();
                
                name_tag.textContent = player_name;
                name_tag_flg = true;

                text_list = ["い、いいい、いえっ！"];
                next_text_show();
            } else if (root_list.Komatsu_root_flg) {
                un_direct_option_flg();

                name_tag.textContent = player_name;
                name_tag_flg = true;

                text_list = ["えっ///"];
                next_text_show();
            } else if (root_list.Hukaya_root_flg) {
                un_direct_option_flg();

                name_tag.textContent = player_name;
                name_tag_flg = true;

                text_list = ["深谷さんのお口に合ってよかったです。また誘っても良いですか？"];
                next_text_show();
            } else if (root_list.Katura_root_flg) {
                un_direct_option_flg();

                text_list = ["チャレンジをする事ってやっぱり重要なんですね"];
                next_text_show();
            }

        } else if (next_text_num == 33) {

            if (root_list.Kitamura_root_flg) {
                un_direct_option_flg();

                character_img.src = "#";
                name_tag_box.style.display = "none";
                narration_flg = true;
                option1_flg = false;
                option2_flg = false;

                loading();
                log_remove();

                loading_flg = true;
                text_list = ["〜食事の後〜"];
                next_text_show();

                loading().then(() => {
                    setTimeout(() => {
                        document.getElementById("loading").style.display = "none";
                    }, 1500);
                    loading_flg = false;
                });
            } else if (root_list.Hashidume_root_flg) {
                un_direct_option_flg();

                text_list = [`あ、あの、${first_person}実は、ハシヅメさんのこと見るとドキドキしちゃうんです…！`];
                name_tag_flg = true;

                next_text_show();
            } else if (root_list.Komatsu_root_flg) {
                un_direct_option_flg();

                name_tag_flg = true;
                text_list = ["つっ、次はあそこにある大きなクリスマスツリーのところ行きませんか？"];

                next_text_show();
            } else if (root_list.Hukaya_root_flg) {
                un_direct_option_flg();

                name_tag.textContent = character_name;
                text_list = ["良いですよ。また行きましょう！"];

                next_text_show();
            } else if (root_list.Katura_root_flg) {
                un_direct_option_flg();

                name_tag_box.style.display = "none";
                narration_flg = true;

                text_list = ["ｷ-ﾝｺ-ﾝｶ-ﾝｺ-ﾝ"];
                next_text_show();
            }

        } else if (next_text_num == 34) {

            if (root_list.Kitamura_root_flg) {
                un_direct_option_flg();

                name_tag.textContent = player_name;
                name_tag_box.style.display = "block";
                name_tag_flg = true;

                text_list = ["ご飯美味しかったですか？"];
                next_text_show();
            } else if (root_list.Hashidume_root_flg) {
                un_direct_option_flg();

                text_list = [`${first_person}、ハシヅメさんのこと好きなのかもしれません…！`];
                name_tag_flg = true;

                next_text_show();
            } else if (root_list.Komatsu_root_flg) {
                un_direct_option_flg();

                name_tag.textContent = character_name;
                text_list = ["あぁ良いですよ"];

                next_text_show();
            } else if (root_list.Hukaya_root_flg) {
                un_direct_option_flg();

                character_img.src = "#";
                name_tag_box.style.display = "none";

                text_list = ["〜授業前〜"];
                narration_flg = true;
                loading_flg = true;

                log_remove();
                loading();
                next_text_show();

                loading().then(() => {
                    setTimeout(() => {
                        document.getElementById("loading").style.display = "none";
                    }, 1500);
                    loading_flg = false;
                });
            } else if (root_list.Katura_root_flg) {
                un_direct_option_flg();

                name_tag_box.style.display = "block";
                text_list = ["これでガイダンスを終わります。ありがとうございました。"];

                next_text_show();
            }

        } else if (next_text_num == 35) {

            if (root_list.Kitamura_root_flg) {
                un_direct_option_flg();

                character_img.src = delivery_img;
                name_tag.textContent = character_name;
                text_list = ["はい！美味しかったです！次はどうしますか？"];

                next_text_show();
            } else if (root_list.Hashidume_root_flg) {
                un_direct_option_flg();

                name_tag.textContent = character_name;
                text_list = ["えぇっ？そ、そうなんですか…？"];

                next_text_show();
            } else if (root_list.Komatsu_root_flg) {
                un_direct_option_flg();

                character_img.src = "#";
                loading_flg = true;

                name_tag.textContent = player_name;
                name_tag_flg = true;
                text_list = ["ツリーとってもキラキラしてて綺麗ですね///（今…伝えなきゃ！）"];

                loading();
                next_text_show();

                loading().then(() => {
                    setTimeout(() => {
                        document.getElementById("loading").style.display = "none";
                    }, 1500);
                    loading_flg = false;
                });
            } else if (root_list.Hukaya_root_flg) {
                un_direct_option_flg();

                name_tag_box.style.display = "block";
                name_tag.textContent = player_name;
                name_tag_flg = true;

                text_list = ["この前はありがとうございました！"];
                next_text_show();
            } else if (root_list.Katura_root_flg) {
                un_direct_option_flg();

                character_img.src = "#";
                name_tag.textContent = "メンバーA";
                nameless_flg = true;

                loading();
                loading_flg = true;

                text_list = [`${player_name}さん！あの考え方素晴らしいと思います！`];
                next_text_show();

                loading().then(() => {
                    setTimeout(() => {
                        document.getElementById("loading").style.display = "none";
                    }, 1500);
                    loading_flg = false;
                });
            }

        } else if (next_text_num == 36) {

            if (root_list.Kitamura_root_flg) {
                un_direct_option_flg();

                name_tag.textContent = player_name;
                name_tag_flg = true;

                text_list = ["次は景色のいい展望台にでも行きませんか？"];
                next_text_show();
            } else if (root_list.Hashidume_root_flg) {
                un_direct_option_flg();

                name_tag.textContent = player_name;
                name_tag_flg = true;
                option_flg = true;

                let option_text = "は、はい…";
                let option1 = "良ければデートに行きませんか！";
                let option2 = "……///（恥ずかしくて何も言えない…）";
                let option1_text = "良いですよ！";
                let option2_text = "ん？どうしたんですか？……もしかしてデートへのお誘いですか？"

                delivery_text_list = [option1_text, option2_text];
                option_display(option_text, option1, option2);
            } else if (root_list.Komatsu_root_flg) {
                un_direct_option_flg();

                character_img.src = "../img/character/Komatsu/Komatsu_1.png";
                name_tag.textContent = character_name;
                text_list = ["綺麗ですね〜"];

                next_text_show();
            } else if (root_list.Hukaya_root_flg) {
                un_direct_option_flg();

                character_img.src = "../img/character/Hukaya/Hukaya_1.png";
                name_tag.textContent = character_name;

                text_list = ["こちらこそ、ありがとうございました"];
                next_text_show();
            } else if (root_list.Katura_root_flg) {
                un_direct_option_flg();

                name_tag.textContent = player_name;
                name_tag_flg = true;

                text_list = ["いえいえ、そんなそんな"];
                next_text_show();
            }

        } else if (next_text_num == 37) {
            
            if (root_list.Kitamura_root_flg) {
                un_direct_option_flg();

                name_tag.textContent = character_name;
                text_list = ["展望台良いっすね！行きましょう！"];
                next_text_show();
            } else if (root_list.Komatsu_root_flg) {
                un_direct_option_flg();

                name_tag.textContent = player_name;
                name_tag_flg = true;

                text_list = ["あの…実は今日、伝えたいことがあるんです！"];
                next_text_show();
            } else if (root_list.Hukaya_root_flg) {
                un_direct_option_flg();

                name_tag.textContent = player_name;
                name_tag_flg = true;

                text_list = ["今夜って、空いてたりしますか？"];
                next_text_show();
            } else if (root_list.Katura_root_flg) {
                un_direct_option_flg();

                character_img.src = "../img/character/Katura/Katura_1.png";
                name_tag.textContent = character_name;

                text_list = ["でも結構いい事だと思いますよ"];
                next_text_show();
            }

        } else if (next_text_num == 38) {

            if (root_list.Kitamura_root_flg) {
                un_direct_option_flg();
                loading();

                character_img.src = "#";
                name_tag.textContent = player_name;
                name_tag_box.style.display = "none";
                name_tag_flg = true;

                text_list = ["いい眺めですね…//（今…伝えなきゃ！）"];
                loading_flg = true;
                next_text_show();

                loading().then(() => {
                    setTimeout(() => {
                        document.getElementById("loading").style.display = "none";
                    }, 1500);
                    loading_flg = false;
                    name_tag_box.style.display = "block";
                });
            } else if (root_list.Hashidume_root_flg) {
                un_direct_option_flg();

                if (option1_flg) {
                    name_tag.textContent = player_name;
                    name_tag_flg = true;

                    text_list = ["！！！"];
                    next_text_show();
                } else if (option2_flg) {
                    name_tag.textContent = player_name;
                    text_list = ["は、はい///"];
                    name_tag_flg = true;

                    next_text_show();
                }
            } else if (root_list.Komatsu_root_flg) {
                un_direct_option_flg();

                name_tag.textContent = character_name;
                option_flg = true;

                let option_text = "なんですか？";
                let option1 = "実はコマツさんのことが好きです！付き合ってください！";
                let option2 = "私とパソコンとWi-Fiのような共存関係になってください///";
                let option1_text = "えっ僕ですか？まぁ僕でよければ…";
                let option2_text = "僕も君との恋愛コードを描いていきたい！だからぜひ僕のコードの一部になってくれ！！";

                delivery_text_list = [option1_text, option2_text];
                option_display(option_text, option1, option2);
            } else if (root_list.Hukaya_root_flg) {
                un_direct_option_flg();

                name_tag.textContent = character_name;
                text_list = ["空いてますよ"];

                next_text_show();
            } else if (root_list.Katura_root_flg) {
                un_direct_option_flg();

                text_list = ["後悔しそうなら大きい事ですね、覚えておきます"];
                next_text_show();
            }

        } else if (next_text_num == 39) {
            
            if (root_list.Kitamura_root_flg) {
                un_direct_option_flg();

                name_tag.textContent = character_name;
                text_list = ["ホントに綺麗っすね…！"];
                next_text_show();
            } else if (root_list.Hashidume_root_flg) {
                un_direct_option_flg();

                if (option1_flg) {
                    text_list = ["やった！"];
                    name_tag_flg = true;
                    option1_flg = false
                } else if (option2_flg) {
                    name_tag.textContent = character_name;
                    text_list = ["もちろん大丈夫ですよ！"];
                    option2_flg = false;
                }

                next_text_show();
            } else if (root_list.Hukaya_root_flg) {
                un_direct_option_flg();

                name_tag.textContent = player_name;
                name_tag_flg = true;

                text_list = ["よければ、ご飯行きませんか？"];
                next_text_show();
            } else if (root_list.Katura_root_flg) {
                un_direct_option_flg();

                name_tag.textContent = player_name;
                name_tag_flg = true;

                text_list = ["いやっそんな！留意するような事ではありませんよ汗"];
                next_text_show();
            }

        } else if (next_text_num == 40) {

            if (root_list.Kitamura_root_flg) {
                un_direct_option_flg();

                name_tag.textContent = player_name;
                name_tag_flg = true;

                text_list = ["あの…実は今日、伝えたいことがあるんです！"];
                next_text_show();
            } else if (root_list.Hashidume_root_flg) {
                un_direct_option_flg();

                name_tag.textContent = player_name;
                name_tag_flg = true;
                text_list = ["で、では明日おやすみですので、お時間があれば！"];

                next_text_show();
            } else if (root_list.Hukaya_root_flg) {
                un_direct_option_flg();

                name_tag.textContent = character_name;
                text_list = ["良いですね、行きましょうか"];

                next_text_show();
            } else if (root_list.Komatsu_root_flg) {
                ending_move();
            } else if (root_list.Katura_root_flg) {
                un_direct_option_flg();

                un_direct_option_flg();

                character_img.src = "#";
                name_tag.textContent = player_name;
                name_tag_flg = true;

                log_remove();
                loading();
                loading_flg = true;

                text_list = [`(あれから${first_person}はVANTANの案内を受け、仕事内容も詳しく教えてもらった)`];
                next_text_show();

                loading().then(() => {
                    setTimeout(() => {
                        document.getElementById("loading").style.display = "none";
                    }, 1500);
                    loading_flg = false;
                });
            }

        } else if (next_text_num == 41) {

            if (root_list.Kitamura_root_flg) {
                un_direct_option_flg();

                let option_text = "…なんでしょう？";
                let option1 = "実はキタムラさんのことが好きなんです！付き合ってください！";
                let option2 = "キタムラさんのことが好きなんだばって、わど付き合ってけね？";
                let option1_text = "マジすか！僕でよければ喜んで！";
                let option2_text = "Je suis heureux！";

                delivery_text_list = [option1_text, option2_text];
                character_img.src = delivery_img;
                name_tag.textContent = character_name;
                option_flg = true;

                option_display(option_text, option1, option2);
                end_flg = true;
            } else if (root_list.Hashidume_root_flg) {
                un_direct_option_flg();

                name_tag.textContent = character_name;
                text_list = ["おっ、ちょうど明日空いてるんですね！是非行きましょう！"];

                next_text_show();
            } else if (root_list.Hukaya_root_flg) {
                un_direct_option_flg();

                character_img.src = "#";
                name_tag_box.style.display = "none";
                narration_flg = true;

                loading();

                loading_flg = true;
                text_list = ["〜食事中〜"];
                next_text_show();

                loading().then(() => {
                    setTimeout(() => {
                        document.getElementById("loading").style.display = "none";
                    }, 1500);
                    loading_flg = false;
                });
            } else if (root_list.Katura_root_flg) {
                un_direct_option_flg();

                name_tag_flg = true;
                text_list = [`(そして数ヶ月経つ頃にはメンバーさんとも仲良くなれ、自ずと${first_person}は相談事を受けることが増えてきた)`];

                next_text_show();
            }

        } else if (next_text_num == 42) {

            if (root_list.Hashidume_root_flg) {
                un_direct_option_flg();

                character_img.src = "#";
                name_tag_box.style.display = "none";
                narration_flg = true;

                loading();
                log_remove();

                loading_flg = true;
                text_list = ["〜次の日〜"];
                next_text_show();

                loading().then(() => {
                    setTimeout(() => {
                        document.getElementById("loading").style.display = "none";
                    }, 1500);
                    loading_flg = false;
                });
            } else if (root_list.Hukaya_root_flg) {
                un_direct_option_flg();

                name_tag_box.style.display = "block";
                name_tag_flg = true;
                name_tag.textContent = player_name;

                text_list = ["この後少しお時間ありますか？"];
                next_text_show();
            } else if (root_list.Katura_root_flg) {
                un_direct_option_flg();

                name_tag.textContent = "メンバーA";
                nameless_flg = true;

                text_list = [`${player_name}さん。実は今進路に悩んでて…`];
                next_text_show();
            }

        } else if (next_text_num == 43) {

            if (root_list.Hashidume_root_flg) {
                un_direct_option_flg();

                character_img.src = "../img/character/Hashidume/Hashidume_2.png";
                name_tag_box.style.display = "block";
                name_tag.textContent = character_name;

                text_list = ["あ！いたいた"];
                next_text_show();
            } else if (root_list.Hukaya_root_flg) {
                un_direct_option_flg();

                character_img.src = "../img/character/Hukaya/Hukaya_1.png";
                name_tag.textContent = character_name;
                option_flg = true;

                let option_text = "ありますよ。どうかしました？";
                let option1 = "ちょっと気晴らしにドライブでも行きませんか？";
                let option2 = "ちょっと気晴らしに散歩でも行きませんか？";
                let option1_text = "良いですよ";
                let option2_text = "良いですよ";

                delivery_text_list = [option1_text, option2_text];
                option_display(option_text, option1, option2);
            } else if (root_list.Kitamura_root_flg) {
                ending_move();
            } else if (root_list.Katura_root_flg) {
                un_direct_option_flg();

                name_tag.textContent = player_name;
                name_tag_flg = true;

                text_list = ["そうか〜、うーん、やりたいことをやればいいと思うよ"];
                next_text_show();
            }

        } else if (next_text_num == 44) {

            if (root_list.Hashidume_root_flg) {
                un_direct_option_flg();

                name_tag.textContent = player_name;
                name_tag_flg = true;

                text_list = ["ハシヅメさん！こんにちは〜"];
                next_text_show();
            } else if (root_list.Katura_root_flg) {
                un_direct_option_flg();

                name_tag.textContent = "メンバーA";
                nameless_flg = true;

                text_list = [`やりたいこと…${player_name}さんみたいになりたいです！`];
                next_text_show();
            }

        } else if (next_text_num == 45) {
            
            if (root_list.Hashidume_root_flg) {
                un_direct_option_flg();

                name_tag.textContent = character_name;
                text_list = ["待たせちゃってごめんね"];

                next_text_show();
            } else if (root_list.Hukaya_root_flg) {
                un_direct_option_flg();

                character_img.src = "#";
                name_tag_box.style.display = "none";
                narration_flg = true;

                loading();
                log_remove();

                loading_flg = true;
                text_list = ["〜外に出て〜"];
                next_text_show();

                loading().then(() => {
                    setTimeout(() => {
                        document.getElementById("loading").style.display = "none";
                    }, 1500);
                    loading_flg = false;
                });
            } else if (root_list.Katura_root_flg) {
                un_direct_option_flg();

                name_tag.textContent = player_name;
                name_tag_flg = true;

                text_list = ["本当？嬉しいなぁ"];
                next_text_show();
            }

        } else if (next_text_num == 46) {

            if (root_list.Hashidume_root_flg) {
                un_direct_option_flg();

                name_tag.textContent = player_name;
                name_tag_flg = true;

                text_list = ["気にしないでください！楽しみすぎて早く来ちゃっただけなので！"];
                next_text_show();
            } else if (root_list.Hukaya_root_flg) {
                un_direct_option_flg();

                character_img.src = "../img/character/Hukaya/Hukaya_1.png";
                name_tag_box.style.display = "block";
                name_tag.textContent = character_name;

                if (option1_flg) {
                    text_list = ["たまにはドライブも良いですね〜"];
                    option1_flg = false;
                } else if (option2_flg) {
                    text_list = ["たまには散歩も良いですね〜"];
                    option2_flg = false;
                }
                next_text_show();
            } else if (root_list.Katura_root_flg) {
                un_direct_option_flg();

                name_tag.textContent = "メンバーA";
                nameless_flg = true;

                text_list = ["そんな、本当の事を言っただけですよ！"];
                next_text_show();
            }

        } else if (next_text_num == 47) {

            if (root_list.Hashidume_root_flg) {
                un_direct_option_flg();

                name_tag.textContent = player_name;
                name_tag_flg = true;

                text_list = ["そんなに？笑"];
                next_text_show();
            } else if (root_list.Hukaya_root_flg) {
                un_direct_option_flg();

                name_tag.textContent = player_name;
                name_tag_flg = true;

                text_list = ["そうですね！"];
                next_text_show();
            } else if (root_list.Katura_root_flg) {
                un_direct_option_flg();

                character_img.src = "#";
                name_tag_box.style.display = "none";
                narration_flg = true;
                loading_flg = true;

                text_list = ["〜4階〜"];
                next_text_show();
                loading();

                loading().then(() => {
                    setTimeout(() => {
                        document.getElementById("loading").style.display = "none";
                    }, 1500);
                    loading_flg = false;
                });
            }
            
        } else if (next_text_num == 48) {

            if (root_list.Hashidume_root_flg) {
                un_direct_option_flg();

                name_tag.textContent = player_name;
                name_tag_flg = true;

                text_list = ["は、はい///"];
                next_text_show();
            } else if (root_list.Hukaya_root_flg) {
                un_direct_option_flg();

                name_tag_flg = true;
                text_list = ["（言うなら今しか無い…！）"];

                next_text_show();
            } else if (root_list.Katura_root_flg) {
                un_direct_option_flg();

                name_tag_box.style.display = "block";
                name_tag.textContent = player_name;
                name_tag_flg = true;

                text_list = ["あ、カツラさんこんにちは"];
                next_text_show();
            }

        } else if (next_text_num == 49) {

            if (root_list.Hashidume_root_flg) {
                un_direct_option_flg();

                name_tag.textContent = character_name;
                text_list = ["嬉しいな笑"];

                next_text_show();
            } else if (root_list.Hukaya_root_flg) {
                un_direct_option_flg();

                name_tag_flg = true;
                text_list = ["あの…！"];

                next_text_show();
            } else if (root_list.Katura_root_flg) {
                un_direct_option_flg();

                character_img.src = "../img/character/Katura/Katura_1.png";
                name_tag.textContent = character_name;
                text_list = [`${player_name}さんこんにちは〜`];

                next_text_show();
            }

        } else if (next_text_num == 50) {

            if (root_list.Hashidume_root_flg) {
                un_direct_option_flg();

                name_tag.textContent = player_name;
                name_tag_flg = true;

                text_list = ["じゃ、じゃあ…どこに行きますか？"];
                next_text_show();
            } else if (root_list.Hukaya_root_flg) {
                un_direct_option_flg();

                name_tag.textContent = character_name;
                option_flg = true;

                let option_text = "どうしました？";
                let option1 = "これからずっと一緒にご飯を食べる権利を私にくれませんか？";
                let option2 = "実は深谷さんのことが好きなんです！私と付き合ってください！";
                let option1_text = "私もあなたとの食事が一番美味しく感じるんです。ぜひ！";
                let option2_text = "ありがとうございます。私でよければ！";

                delivery_text_list = [option1_text, option2_text];
                option_display(option_text, option1, option2);
            } else if (root_list.Katura_root_flg) {
                un_direct_option_flg();

                text_list = ["メンバーのメンタルケアまでしてもらって…本当ありがとうございます"];
                next_text_show();
            }
            
        } else if (next_text_num == 51) {

            if (root_list.Hashidume_root_flg) {
                
                name_tag.textContent = character_name;
                text_list = ["僕、見たい映画があるんですよね〜"];

                next_text_show();
            } else if (root_list.Katura_root_flg) {
                un_direct_option_flg();

                name_tag.textContent = player_name;
                name_tag_flg = true;

                text_list = ["いえいえ、楽しくやらせてもらっているので！"];
                next_text_show();
            }

        } else if (next_text_num == 52) {

            if (root_list.Hashidume_root_flg) {
                un_direct_option_flg();

                name_tag.textContent = player_name;
                name_tag_flg = true;

                text_list = ["映画ですか！行きましょう！"];
                next_text_show();
            } else if (root_list.Hukaya_root_flg) {
                un_direct_option_flg();

                option1_flg = false;
                option2_flg = false;

                text_list = ["一緒に美味しいものを沢山食べに行きましょう！"];
                next_text_show();
            } else if (root_list.Katura_root_flg) {
                un_direct_option_flg();

                name_tag.textContent = character_name;
                text_list = ["ところで近いうちに親睦も兼ねてご飯でも行きませんか？"];

                next_text_show();
            }

        } else if (next_text_num == 53) {

            if (root_list.Hashidume_root_flg) {
                un_direct_option_flg();

                character_img.src = "#";
                name_tag_box.style.display = "none";
                narration_flg = true;
                loading_flg = true;

                text_list = ["〜映画館にて〜"];
                next_text_show();
                loading();

                loading().then(() => {
                    setTimeout(() => {
                        document.getElementById("loading").style.display = "none";
                    }, 1500);
                    loading_flg = false;
                });
            } else if (root_list.Hukaya_root_flg) {
                ending_move();
            } else if (root_list.Katura_root_flg) {
                un_direct_option_flg();

                name_tag.textContent = player_name;
                name_tag_flg = true;

                text_list = ["いいですね！私ココとココと〜……が空いてますね"];
                next_text_show();
            }

        } else if (next_text_num == 54) {

            if (root_list.Hashidume_root_flg) {
                un_direct_option_flg();

                name_tag_box.style.display = "block";
                name_tag.textContent = player_name;
                name_tag_flg = true;

                text_list = ["ハシヅメさん！ポップコーンどうしますか？"];
                next_text_show();
            } else if (root_list.Katura_root_flg) {
                un_direct_option_flg();

                name_tag.textContent = character_name;
                text_list = ["じゃあ、ここのタイミングで"];

                next_text_show();
            }

        } else if (next_text_num == 55) {

            if (root_list.Hashidume_root_flg) {
                un_direct_option_flg();

                character_img.src = "../img/character/Hashidume/Hashidume_1.png";
                character_img.style.padding = "0";
                name_tag.textContent = character_name;
                option_flg = true;

                let option_text = `買っちゃおうか！${player_name}さんが選んでいいよ`;
                let option1 = "ガーリックチーズにしましょう！";
                let option2 = "キャラメルにしましょう！";
                let option1_text = "ガ、ガーリックチーズ…";
                let option2_text = "キャラメル良いね！そうしよう！";

                delivery_text_list = [option1_text, option2_text];
                option_display(option_text, option1, option2);
            } else if (root_list.Katura_root_flg) {
                un_direct_option_flg();

                name_tag.textContent = player_name;
                name_tag_flg = true;

                text_list = ["了解です！"];
                next_text_show();
            }

        } else if (next_text_num == 56) {

            if (root_list.Katura_root_flg) {
                un_direct_option_flg();

                character_img.src = "#";
                name_tag_box.style.display = "none";
                narration_flg = true;
                loading_flg = true;

                text_list = ["〜日が暮れる頃〜"];
                next_text_show();
                loading();

                loading().then(() => {
                    setTimeout(() => {
                        document.getElementById("loading").style.display = "none";
                    }, 1500);
                    loading_flg = false;
                });
            }

        } else if (next_text_num == 57) {

            if (root_list.Hashidume_root_flg) {
                un_direct_option_flg();

                name_tag.textContent = character_name;
                text_list = ["じゃ、見に行こっか"];
                option1_flg = false;
                option2_flg = false;

                next_text_show();
            } else if (root_list.Katura_root_flg) {
                un_direct_option_flg();

                name_tag_box.style.display = "block";
                name_tag.textContent = player_name;
                name_tag_flg = true;

                text_list = ["今度食事に行こうってカツラさんから誘われたんですよ！"];
                next_text_show();
            }

        } else if (next_text_num == 58) {

            if (root_list.Hashidume_root_flg) {
                un_direct_option_flg();

                character_img.src = "#";
                name_tag_box.style.display = "none";
                narration_flg = true;
                loading_flg = true;

                text_list = ["〜映画が終わり〜"];
                next_text_show();
                loading();

                loading().then(() => {
                    setTimeout(() => {
                        document.getElementById("loading").style.display = "none";
                    }, 1500);
                    loading_flg = false;
                });
            } else if (root_list.Katura_root_flg) {
                un_direct_option_flg();

                character_img.src = "../img/character/Kajima/Kajima_2.png";
                character_img.style.padding = "0";

                name_tag_box.style.display = "block";
                name_tag.textContent = "タカヨ";
                nameless_flg = true;

                text_list = ["お食事いいですね！"];
                next_text_show();
            }

        } else if (next_text_num == 59) {

            if (root_list.Hashidume_root_flg) {
                un_direct_option_flg();

                character_img.src = "../img/character/Hashidume/Hashidume_1.png";
                name_tag.textContent = character_name;
                name_tag_box.style.display = "block";

                text_list = ["いや〜あそこのシーン良かったよね！"];
                next_text_show();
            } else if (root_list.Katura_root_flg) {
                un_direct_option_flg();

                name_tag.textContent = player_name;
                name_tag_flg = true;

                text_list = ["そこで相談なんですけど、いつもお世話になってるお礼に何か贈り物でもと思いまして"];
                next_text_show();
            }

        } else if (next_text_num == 60) {

            if (root_list.Hashidume_root_flg) {
                un_direct_option_flg();

                name_tag.textContent = player_name;
                name_tag_flg = true;

                text_list = ["あのキャラもすっごく可愛かったです！"];
                next_text_show();
            } else if (root_list.Katura_root_flg) {
                un_direct_option_flg();

                character_img.src = "../img/character/Kajima/Kajima_1.png";
                name_tag.textContent = "カツヨシ";
                nameless_flg = true;

                text_list = ["なら腕時計とかどうですか？"];
                next_text_show();
            }

        } else if (next_text_num == 61) {

            if (root_list.Hashidume_root_flg) {
                un_direct_option_flg();

                name_tag.textContent = character_name;
                text_list = ["だね〜"];

                next_text_show();
            } else if (root_list.Katura_root_flg) {
                un_direct_option_flg();

                character_img.src = "../img/character/Kajima/Kajima_2.png";
                name_tag.textContent = "タカヨ";
                nameless_flg = true;

                text_list = ["そうですね、この前壊れてしまったと言っていましたし"];
                next_text_show();
            }

        } else if (next_text_num == 62) {

            if (root_list.Hashidume_root_flg) {
                un_direct_option_flg();
                option_flg = true;

                let option_text = "何かグッズでも買っていく？";
                let option1 = "買いに行きましょう！";
                let option2 = "ごめんなさい…お金が無いので買わないでおきます";
                let option1_text = "お揃いのグッズ買おうよ！";
                let option2_text = "そっかぁ…残念";

                delivery_text_list = [option1_text, option2_text];
                option_display(option_text, option1, option2);
            } else if (root_list.Katura_root_flg) {
                un_direct_option_flg();

                name_tag.textContent = player_name;
                name_tag_flg = true;

                text_list = ["そうなんですね、なら腕時計にします！"];
                next_text_show();
            }

        } else if (next_text_num == 63) {

            if (root_list.Katura_root_flg) {
                un_direct_option_flg();

                name_tag.textContent = "タカヨ";
                nameless_flg = true;

                text_list = ["頑張ってください！"];
                next_text_show();
            }
            
        } else if (next_text_num == 64) {

            if (root_list.Hashidume_root_flg) {
                un_direct_option_flg();

                loading_flg = true;
                option1_flg = false;
                option2_flg = false;

                text_list = ["いや〜それにしても外暑いね〜"];
                next_text_show();
                loading();

                loading().then(() => {
                    setTimeout(() => {
                        document.getElementById("loading").style.display = "none";
                    }, 1500);
                    loading_flg = false;
                });
            } else if (root_list.Katura_root_flg) {
                un_direct_option_flg();

                character_img.src = "../img/character/Kajima/Kajima_1.png";
                name_tag.textContent = "カツヨシ";
                nameless_flg = true;

                text_list = ["GOOD LUCK！"];
                next_text_show();
            }

        } else if (next_text_num == 65) {

            if (root_list.Hashidume_root_flg) {
                un_direct_option_flg();

                name_tag.textContent = player_name;
                name_tag_flg = true;

                text_list = ["そ、そうですね"];
                next_text_show();
            } else if (root_list.Katura_root_flg) {
                un_direct_option_flg();

                name_tag.textContent = player_name;
                name_tag_flg = true;

                text_list = ["頑張ります！"];
                next_text_show();
            }
            
        } else if (next_text_num == 66) {

            if (root_list.Hashidume_root_flg) {
                un_direct_option_flg();

                name_tag.textContent = character_name;
                text_list = ["アイスでも食べる？"];

                next_text_show();
            } else if (root_list.Katura_root_flg) {
                un_direct_option_flg();

                character_img.src = "#";
                name_tag_box.style.display = "none";
                narration_flg = true;
                loading_flg = true;

                text_list = ["〜食事の日〜"];
                next_text_show();
                loading();

                loading().then(() => {
                    setTimeout(() => {
                        document.getElementById("loading").style.display = "none";
                    }, 1500);
                    loading_flg = false;
                });
            }

        } else if (next_text_num == 67) {

            if (root_list.Hashidume_root_flg) {
                un_direct_option_flg();

                name_tag.textContent = player_name;
                name_tag_flg = true;
                option_flg = true;

                let option_text = "食べましょうか！涼みましょう！";
                let option1 = "バニラ一緒に食べませんか？";
                let option2 = "大納言あずき食べませんか？";
                let option1_text = "そうしましょう！";
                let option2_text = "だ、大納言あずき…？";

                delivery_text_list = [option1_text, option2_text];
                option_display(option_text, option1, option2);
            } else if (root_list.Katura_root_flg) {
                un_direct_option_flg();

                character_img.src = "../img/character/Katura/Katura_1.png";
                character_img.style.padding = "50px 0 0 0";

                name_tag_box.style.display = "block";
                name_tag.textContent = character_name;

                text_list = [`${player_name}さん。そろそろ行きましょうか`];
                next_text_show();
            }

        } else if (next_text_num == 68) {

            if (root_list.Katura_root_flg) {
                un_direct_option_flg();

                name_tag.textContent = player_name;
                name_tag_flg = true;

                text_list = ["そういえばお店ってどこに行くんですか？"];
                next_text_show();
            }

        } else if (next_text_num == 69) {

            if (root_list.Hashidume_root_flg) {
                un_direct_option_flg();

                name_tag_flg = true;
                option1_flg = false;
                option2_flg = false;

                text_list = ["ん〜〜〜〜！！冷たくて美味しいです！"];
                next_text_show();
            } else if (root_list.Katura_root_flg) {
                un_direct_option_flg();

                name_tag.textContent = character_name;
                text_list = ["任せてください。いい所知ってるんで"];

                next_text_show();
            }

        } else if (next_text_num == 70) {

            if (root_list.Hashidume_root_flg) {
                un_direct_option_flg();

                name_tag.textContent = character_name;
                text_list = ["結構涼めたね〜"];

                next_text_show();
            } else if (root_list.Katura_root_flg) {
                un_direct_option_flg();

                character_img.src = "#";
                name_tag_box.style.display = "none";
                narration_flg = true;
                loading_flg = true;

                text_list = ["〜食事の後〜"];
                next_text_show();
                loading();

                loading().then(() => {
                    setTimeout(() => {
                        document.getElementById("loading").style.display = "none";
                    }, 1500);
                    loading_flg = false;
                });
            }
            
        } else if (next_text_num == 71) {

            if (root_list.Hashidume_root_flg) {
                un_direct_option_flg();

                text_list = ["そろそろ良い時間だし、今日はここら辺で解散にしようか"]
                next_text_show();
            } else if (root_list.Katura_root_flg) {
                un_direct_option_flg();

                name_tag_box.style.display = "block";
                name_tag_flg = true;
                name_tag.textContent = player_name;

                text_list = ["ここの和食すごく美味しかったです！"];
                next_text_show();
            }

        } else if (next_text_num == 72) {

            if (root_list.Hashidume_root_flg) {
                un_direct_option_flg();

                name_tag.textContent = player_name;
                name_tag_flg = true;

                text_list = ["そう…ですね…"];
                next_text_show();
            } else if (root_list.Katura_root_flg) {
                un_direct_option_flg();

                name_tag_flg = true;
                text_list = [`${first_person}、和食好きなんですよね〜`];

                next_text_show();
            }

        } else if (next_text_num == 73) {

            if (root_list.Hashidume_root_flg) {
                un_direct_option_flg();

                name_tag_flg = true;
                text_list = ["えと、その…"];
                next_text_show();
            } else if (root_list.Katura_root_flg) {
                un_direct_option_flg();

                character_img.src = "../img/character/Katura/Katura_1.png";
                name_tag.textContent = character_name;

                text_list = ["どうやら僕の予想は当たっていたようですね！"];
                next_text_show();
            }

        } else if (next_text_num == 74) {

            if (root_list.Hashidume_root_flg) {
                un_direct_option_flg();

                name_tag.textContent = character_name;
                text_list = ["どうしたんですか？"];

                next_text_show();
            } else if (root_list.Katura_root_flg) {
                un_direct_option_flg();

                name_tag.textContent = player_name;
                name_tag_flg = true;

                text_list = [`(すごい…${first_person}の好みまで見通されてるようでなんだか嬉しいっ！)`];
                next_text_show();
            }

        } else if (next_text_num == 75) {

            if (root_list.Hashidume_root_flg) {
                un_direct_option_flg();

                name_tag.textContent = player_name;
                option_flg = true;

                let option_text = "あの！ハシヅメさん…！";
                let option1 = `${first_person}と付き合ってください！`;
                let option2 = `${first_person}付き合ってくだせぇっ！`;

                option_display(option_text, option1, option2);
            } else if (root_list.Katura_root_flg) {
                un_direct_option_flg();

                name_tag_flg = true;
                text_list = ["実は今日、渡したいものがありまして…！"];

                next_text_show();
            }

        } else if (next_text_num == 76) {

            if (root_list.Katura_root_flg) {
                un_direct_option_flg();

                name_tag_flg = true;
                text_list = ["日頃のお礼として受け取っていただけば幸いです"];

                next_text_show();
            }

        } else if (next_text_num == 77) {

            if (root_list.Hashidume_root_flg) {
                ending_move();
            } else if (root_list.Katura_root_flg) {
                un_direct_option_flg();

                name_tag.textContent = character_name;
                text_list = ["おお！腕時計じゃないですか！"];

                next_text_show();
            }

        } else if (next_text_num == 78) {

            if (root_list.Katura_root_flg) {
                un_direct_option_flg();

                text_list = ["最近壊れてしまって…ありがとうございます！"];
                next_text_show();
            }

        } else if (next_text_num == 79) {

            if (root_list.Katura_root_flg) {
                un_direct_option_flg();

                name_tag.textContent = player_name;
                name_tag_flg = true;
                option_flg = true;

                let option_text = "いえいえ、いつもお世話になっていますので";
                let option1 = "その…できればなんですが、今後ともご飯とかいかがですか？";
                let option2 = "カツラさんとのご飯楽しかったです！また行きたいです！";
                let option1_text = "是非是非、また行きましょう";
                let option2_text = "楽しんでもらえて何よりです！また行きましょう！";

                delivery_text_list = [option1_text, option2_text];
                option_display(option_text, option1, option2);
            }

        } else if (next_text_num == 81) {

            if (root_list.Katura_root_flg) {
                un_direct_option_flg();

                name_tag.textContent = player_name;
                name_tag_flg = true;

                text_list = ["(……これまでもカジマさん達やハシヅメさんとご飯に行ったことはあったけど)"];
                next_text_show();
            }
            
        } else if (next_text_num == 82) {

            if (root_list.Katura_root_flg) {
                un_direct_option_flg();

                name_tag_flg = true;
                text_list = ["(なんだかカツラさんだとまた別の嬉しさがあるというか…)"];

                next_text_show();
            }

        } else if (next_text_num == 83) {

            if (root_list.Katura_root_flg) {
                un_direct_option_flg();

                name_tag_flg = true;
                text_list = ["(もしかして…)"];

                next_text_show();
            }

        } else if (next_text_num == 84) {

            if (root_list.Katura_root_flg) {
                un_direct_option_flg();

                character_img.src = "#";
                name_tag_flg = true;
                loading_flg = true;

                text_list = ["(あれから何度もカツラさんとお食事に行ったり、時にはお買い物に出かけることもあった)"];
                next_text_show();
                log_remove();
                loading();

                loading().then(() => {
                    setTimeout(() => {
                        document.getElementById("loading").style.display = "none";
                    }, 1500);
                    loading_flg = false;
                });
            }

        } else if (next_text_num == 85) {

            if (root_list.Katura_root_flg) {
                un_direct_option_flg();

                name_tag_flg = true;
                text_list = ["(そしてあの気持ちもカツラさんと会う度に増していった)"];

                next_text_show();
            }

        } else if (next_text_num == 86) {

            if (root_list.Katura_root_flg) {
                un_direct_option_flg();
                
                name_tag_flg = true;
                text_list = [`(気付けば${first_person}の側からカツラさんがいなくなることが少なくなった)`];

                next_text_show();
            }

        } else if (next_text_num == 87) {

            if (root_list.Katura_root_flg) {
                un_direct_option_flg();

                name_tag_flg = true;
                text_list = ["カツラさん、この資料ここに置いておきますね"];

                next_text_show();
            }

        } else if (next_text_num == 88) {

            if (root_list.Katura_root_flg) {
                un_direct_option_flg();

                character_img.src = "../img/character/Katura/Katura_5.png";
                character_img.style.padding = "0";

                name_tag.textContent = character_name;
                text_list = [`ありがとうね。${player_name}さん`];

                next_text_show();
            }

        } else if (next_text_num == 89) {

            if (root_list.Katura_root_flg) {
                un_direct_option_flg();

                name_tag.textContent = player_name;
                name_tag_flg = true;

                text_list = ["(なんだかカツラさんの元気がないように見えるな…)"];
                next_text_show();
            }

        } else if (next_text_num == 90) {

            if (root_list.Katura_root_flg) {
                un_direct_option_flg();

                name_tag_flg = true;
                text_list = ["あ、そこってこうでしたっけ？"];

                next_text_show();
            }

        } else if (next_text_num == 91) {

            if (root_list.Katura_root_flg) {
                un_direct_option_flg();

                name_tag.textContent = character_name;
                option_flg = true;

                let option_text = "ああ…これは…そうだね";
                let option1 = "そういえば、疲れを取れるツボ押しグッズがあるので試してみませんか？";
                let option2 = "何か元気になれる飲み物でも買ってきましょうか？";
                let option1_text = "ありがとう…";
                let option2_text = "ありがとう。それなら甘めの飲み物をお願いします";

                delivery_text_list = [option1_text, option2_text];
                option_display(option_text, option1, option2);
            }

        } else if (next_text_num == 93) {

            if (root_list.Katura_root_flg) {
                un_direct_option_flg();

                name_tag.textContent = player_name;
                name_tag_flg = true;

                text_list = ["じゃあ行ってきますね"];
                next_text_show();
            }

        } else if (next_text_num == 94) {

            if (root_list.Katura_root_flg) {
                un_direct_option_flg();

                character_img.src = "#";
                name_tag_box.style.display = "none";
                narration_flg = true;
                loading_flg = true;

                text_list = ["〜戻ってきて〜"];
                next_text_show();
                loading();

                loading().then(() => {
                    setTimeout(() => {
                        document.getElementById("loading").style.display = "none";
                    }, 1500);
                    loading_flg = false;
                });
            }

        } else if (next_text_num == 95) {

            if (root_list.Katura_root_flg) {
                un_direct_option_flg();

                character_img.src = "../img/character/Hashidume/Hashidume_1.png";
                name_tag_box.style.display = "block";
                name_tag.textContent = "ハシヅメ";
                nameless_flg = true;

                text_list = ["カツラさんあの話って本当なんですか？"];
                next_text_show();
            }

        } else if (next_text_num == 96) {

            if (root_list.Katura_root_flg) {
                un_direct_option_flg();

                character_img.src = "../img/character/Katura/Katura_1.png";
                character_img.style.padding = "50px 0 0 0";
                name_tag.textContent = character_name;

                text_list = ["何の話です？まさか一発ギャグをしてくれるっていう！？"];
                next_text_show();
            }
            
        } else if (next_text_num == 97) {

            if (root_list.Katura_root_flg) {
                un_direct_option_flg();

                character_img.src = "../img/character/Hashidume/Hashidume_1.png";
                name_tag.textContent = "ハシヅメ";
                nameless_flg = true;

                text_list = ["聞きましたよ！東京校の方がスタッフ不足だから向こうに異動するって！"];
                next_text_show();
            }

        } else if (next_text_num == 98) {

            if (root_list.Katura_root_flg) {
                un_direct_option_flg();

                name_tag.textContent = player_name;
                name_tag_flg = true;

                text_list = ["(え……)"];
                next_text_show();
            }

        } else if (next_text_num == 99) {

            if (root_list.Katura_root_flg) {
                un_direct_option_flg();

                character_img.src = "../img/character/Katura/Katura_1.png";
                name_tag.textContent = character_name;

                text_list = ["そうですか...聞いていたんですね"];
                next_text_show();
            }

        } else if (next_text_num == 100) {

            if (root_list.Katura_root_flg) {
                un_direct_option_flg();

                character_img.src = "../img/character/Hashidume/Hashidume_1.png";
                name_tag.textContent = "ハシヅメ";
                nameless_flg = true;

                text_list = ["はい…少し…"];
                next_text_show();
            }

        } else if (next_text_num == 101) {

            if (root_list.Katura_root_flg) {
                un_direct_option_flg();

                name_tag.textContent = player_name;
                name_tag_flg = true;

                text_list = ["(分からない…今どういう状況なのか…)"];
                next_text_show();
            }

        } else if (next_text_num == 102) {

            if (root_list.Katura_root_flg) {
                un_direct_option_flg();

                name_tag_flg = true;
                text_list = ["(カツラさんが東京に行くことを拒絶しているようで…理解ができない…)"];

                next_text_show();
            }

        } else if (next_text_num == 103) {

            if (root_list.Katura_root_flg) {
                un_direct_option_flg();

                character_img.src = "#";
                name_tag_flg = true;
                option_flg = true;

                let option_text = "(でも…ここであの気持ちと向き合わないと…！)";
                let option1 = "告白する";
                let option2 = "・・・";
                let option1_text = "(言葉が出ない…でも…！)";
                let option2_text = "・・・";

                delivery_text_list = [option1_text, option2_text];
                option_display(option_text, option1, option2);
            }

        } else if (next_text_num == 105) {

            if (root_list.Katura_root_flg) {
                let option_text = "テキスト";
                let option1 = "告白をしたい！";
                let option2 = "・・・ ";
                let option1_text = "カツラさん！！すっっっ！！…きやきのまね～(激スベり)";
                let option2_text = "(そうだ…今好きだなんて言ったらきっとカツラさんも困るよ…)";

                option_flg = true;
                direct_option_flg = true;

                delivery_text_list = [option1_text, option2_text];
                option_display(option_text, option1, option2);
            }

        } else if (next_text_num == 107) {

            if (root_list.Katura_root_flg) {
                un_direct_option_flg();

                name_tag.textContent = "その場にいる全員";
                nameless_flg = true;

                text_list = ["・・・"];
                next_text_show();
            }

        } else if (next_text_num == 108) {

            if (root_list.Katura_root_flg) {
                un_direct_option_flg();

                character_img.src = "../img/character/Katura/Katura_1.png";
                name_tag.textContent = character_name;
                text_list = ["…出世…ってことですかね…"];

                next_text_show();
            }

        } else if (next_text_num == 109) {

            if (root_list.Katura_root_flg) {
                un_direct_option_flg();

                name_tag.textContent = player_name;
                name_tag_flg = true;

                text_list = ["(…そうだ、カツラさんの言った通り出世したと捉えることだって出来る)"];
                next_text_show();
            }

        } else if (next_text_num == 110) {

            if (root_list.Katura_root_flg) {
                un_direct_option_flg();

                name_tag_flg = true;
                text_list = ["(うん…応援することにしよう！)"];

                next_text_show();
            }

        } else if (next_text_num == 111) {

            if (root_list.Katura_root_flg) {
                un_direct_option_flg();

                character_img.src = "#";
                name_tag_box.style.display = "none";
                narration_flg = true;
                loading_flg = true;

                text_list = ["〜その日の帰り〜"];
                next_text_show();
                loading();

                loading().then(() => {
                    setTimeout(() => {
                        document.getElementById("loading").style.display = "none";
                    }, 1500);
                    loading_flg = false;
                });
            }

        } else if (next_text_num == 112) {

            if (root_list.Katura_root_flg) {
                un_direct_option_flg();

                name_tag_box.style.display = "block";
                name_tag.textContent = player_name;
                name_tag_flg = true;

                text_list = ["カツラさん、出世？おめでとうございます！"];
                next_text_show();
            }

        } else if (next_text_num == 113) {

            if (root_list.Katura_root_flg) {
                un_direct_option_flg();

                character_img.src = "../img/character/Katura/Katura_1.png";
                name_tag.textContent = character_name;
                text_list = ["ありがとう。でも正直困っているところはあるんですよね"];

                next_text_show();
            }

        } else if (next_text_num == 114) {

            if (root_list.Katura_root_flg) {
                un_direct_option_flg();

                text_list = ["やっぱり名古屋校でこうして仕事をするのも楽しかったので"];
                next_text_show();
            }

        } else if (next_text_num == 115) {

            if (root_list.Katura_root_flg) {
                un_direct_option_flg();

                name_tag.textContent = player_name;
                name_tag_flg = true;

                text_list = ["大きいことに挑戦するいいチャンスじゃないんですか？"];
                next_text_show();
            }

        } else if (next_text_num == 116) {

            if (root_list.Katura_root_flg) {
                un_direct_option_flg();

                name_tag_flg = true;
                option_flg = true;

                let option_text = "それにカツラさんだって挑戦することが大事って言ってたじゃないですか";
                let option1 = "正直に言うと…カツラさんのこと好きですよ。人としても、それ以外の意味でも";
                let option2 = "カツラさんは誰からも尊敬される人だと思ってますよ！";
                let option1_text = "そんな魅力的な方が東京に行ったら失敗するなんて考えられません！";
                let option2_text = "そんな人が東京で失敗なんてある訳ないじゃないですか！";

                delivery_text_list = [option1_text, option2_text];
                option_display(option_text, option1, option2);
            }

        } else if (next_text_num == 118) {

            if (root_list.Katura_root_flg) {
                un_direct_option_flg();

                name_tag_flg = true;
                text_list = [`まあ…${first_person}の言葉は独り言程度に受け取ってもらえればいいので…`];

                next_text_show();
            }

        } else if (next_text_num == 119) {

            if (root_list.Katura_root_flg) {
                un_direct_option_flg();

                name_tag.textContent = character_name;
                text_list = ["そうだね…決めたよ"];

                next_text_show();
            }

        } else if (next_text_num == 120) {

            if (root_list.Katura_root_flg) {
                un_direct_option_flg();

                text_list = ["僕は……"];
                next_text_show();
            }

        } else if (next_text_num == 121) {

            if (root_list.Katura_root_flg) {
                ending_move();
            }

        }
        
        setTimeout(() => {
            next_button.style.display = "none";
        }, 310);

        async function next_text_show() {
            if (!option_flg) {
                if (loading_flg) {
                    setTimeout(() => {
                        show_text(text_division(text_list));
                    }, 1500);
                } else if (!end_flg) {
                    show_text(text_division(text_list));
                }
            }
        }

        function un_direct_option_flg() {
            if (!direct_option_flg) {
                current_text.innerHTML = ""; // 現在のテキストを初期化
            }
        }
        
    }
    console.log("現在のテキスト番号 : " + String(next_text_num)); // 現在のテキスト番号 (デバッグ用)
}

// エンディング画面へ遷移
function ending_move() {
    const loading = document.getElementById("loading");
    localStorage.setItem("favourable_impression", favourable_impression);

    loading_display().then(() => {
        window.location = "ending.html"; // resolveが返されたらURLを変更してページを遷移
    });

    function loading_display() {
        return new Promise(async (resolve) => {
            loading.style.backgroundColor = "#fff";
            loading.style.display = "block";
            loading.style.opacity = 0;

            await new Promise(requestAnimationFrame);

            await new Promise(resolve => setTimeout(resolve, 100));
            loading.style.zIndex = 50;
            loading.style.transition = "opacity 1.5s";
            loading.style.opacity = 1;

            await new Promise(resolve => setTimeout(resolve, 1500));
            resolve();
        });
    }
}

// ローディング
async function loading() {
    return new Promise(async (resolve) => {
        const loading = document.getElementById("loading");
        const background_img = document.getElementById("main_box");

        loading.style.display = "block";

        setTimeout(() => {
            loading.style.backgroundColor = "#111";
            loading.style.zIndex = 0;
            loading.style.opacity = 1;
        }, 100);

        setTimeout(() => {
            if (root_list.Kitamura_root_flg) {
                if (next_text_num == 7) {
                    background_img.style.backgroundImage = "url('../img/background/503_class2.jpg')";
                } else if (next_text_num == 19) {
                    background_img.style.backgroundImage = "url('../img/background/5F_space3.jpg')";
                } else if (next_text_num == 33) {
                    background_img.style.backgroundImage = "url('../img/background/4F_space2.jpg')";
                } else if (next_text_num == 38) {
                    background_img.style.backgroundImage = "url('../img/background/Nagoya_view.jpg')";
                }
            } else if (root_list.Hashidume_root_flg) {
                if (next_text_num == 9) {
                    background_img.style.backgroundImage = "url('../img/background/402_class3.jpg')";
                } else if (next_text_num == 25) {
                    background_img.style.backgroundImage = "url('../img/background/4F_space1.jpg')";
                } else if (next_text_num == 42) {
                    background_img.style.backgroundImage = "url('../img/background/2F_space1.jpg')";
                } else if (next_text_num == 53) {
                    background_img.style.backgroundImage = "url('../img/background/cinema_shop.png')";
                } else if (next_text_num == 64) {
                    background_img.style.backgroundImage = "url('../img/background/ice_cream_store.jpg')";
                }
            } else if (root_list.Komatsu_root_flg) {
                if (next_text_num == 5) {
                    background_img.style.backgroundImage = "url('../img/background/402_class2.jpg')";
                } else if (next_text_num == 17) {
                    background_img.style.backgroundImage = "url('../img/background/5F_space2.jpg')";
                } else if (next_text_num == 30) {
                    background_img.style.backgroundImage = "url('../img/background/Night_Park.jpg')";
                } else if (next_text_num == 35) {
                    background_img.style.backgroundImage = "url('../img/background/Christmas tree.webp')";
                }
            } else if (root_list.Hukaya_root_flg) {
                if (next_text_num == 6) {
                    background_img.style.backgroundImage = "url('../img/background/504_class1.jpg')";
                } else if (next_text_num == 18) {
                    background_img.style.backgroundImage = "url('../img/background/5F_space1.jpg')";
                } else if (next_text_num == 25) {
                    background_img.style.backgroundImage = "url('../img/background/restaurant.jpg')";
                } else if (next_text_num == 34) {
                    background_img.style.backgroundImage = "url('../img/background/504_class1.jpg')";
                } else if (next_text_num == 41) {
                    background_img.style.backgroundImage = "url('../img/background/normal_restaurant.jpg')";
                } else if (next_text_num == 45) {
                    background_img.style.backgroundImage = "url('../img/background/Night_street.jpg')";
                }
            } else if (root_list.Katura_root_flg) {
                if (next_text_num == 11) {
                    background_img.style.backgroundImage = "url('../img/background/403_class1.jpg')";
                } else if (next_text_num == 40) {
                    background_img.style.backgroundImage = "url('../img/background/5F_space3.jpg')";
                } else if (next_text_num == 47) {
                    background_img.style.backgroundImage = "url('../img/background/4F_space1.jpg')";
                } else if (next_text_num == 56) {
                    background_img.style.backgroundImage = "url('../img/background/4F_space2.jpg')";
                } else if (next_text_num == 66) {
                    background_img.style.backgroundImage = "url('../img/background/2F_space1.jpg')";
                } else if (next_text_num == 70) {
                    background_img.style.backgroundImage = "url('../img/background/restaurant.jpg')";
                } else if (next_text_num == 84) {
                    background_img.style.backgroundImage = "url('../img/background/5F_space1.jpg')";
                } else if (next_text_num == 111) {
                    background_img.style.backgroundImage = "url('../img/background/2F_space2.jpg')";
                }
            }

            loading.style.opacity = 0;
            resolve();
        }, 1600);
    });
}

// ログの中身を削除
function log_remove() {
    const log_sidebar_text = document.getElementById("log_sidebar_text");

    while (log_sidebar_text.firstChild) {
        log_sidebar_text.removeChild(log_sidebar_text.firstChild);
    }
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
                let option_box1 = document.getElementById("option_box1");
                let option_box2 = document.getElementById("option_box2");
    
                async function text_window_reset() {
                    await new Promise(resolve => setTimeout(resolve, 775));
                    text_window.style.display = "flex"; // テキストウィンドウのdisplayを元に戻す(flex)
                    text_window.style.height = "250px"; // テキストウィンドウの高さを元に戻す
                    character_img.className = "character_img_box"; // キャラクターの背景を元に戻す
                    current_text.className = "current_text"; // 現在のテキストのクラスを元に戻す

                    option_box1.className = "option_box";
                    option_box2.className = "option_box";
                    option_box1.style.display = "flex";
                    option_box2.style.display = "flex";
    
                    await new Promise(resolve => setTimeout(resolve, 1075));
                    current_text.innerHTML = current_text.innerHTML.concat(passed_text_list[current_index]); // 新しいテキストを挿入
                    current_index++;

                    if (!direct_option_flg) {
                        setTimeout(() => {
                            show_text(passed_text_list).then(resolve);
                        }, 100);
                    }
                }
                text_window_reset();
                
                option_selected_flg = false;
                next_text_num += 1;
            } else {
                current_text.innerHTML = current_text.innerHTML.concat(passed_text_list[current_index]); // 新しいテキストを挿入
                current_index++;
                setTimeout(() => {
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
                    setTimeout(() => {
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
    if (!narration_flg) {
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

        if (name_tag_flg || nameless_flg) {
            let log_text_player_box = document.createElement("div"); // 選択肢を選んだ場合のテキストを入れる<div>要素を作成

            log_text_player_box.style.display = "flex";
            option_addition.style.color = "#fff";
            option_addition.style.margin = "0 15px 0 0";

            log_text_player_box.appendChild(option_addition);
            log_text_player_box.appendChild(log_text);
            log_text_box.appendChild(log_text_player_box);

            if (nameless_flg) { // プレイヤー、キャラクター以外のセリフの場合
                log_name_tag.textContent = name_tag.textContent;
                nameless_flg = false
            } else { // プレイヤーのセリフの場合
                log_name_tag.textContent = player_name; // ネームタグにプレイヤー名を入れる

                let player_log_text = log_name_tag.nextElementSibling; // プレイヤー名の兄弟要素(プレイヤーのセリフ)を取得
                player_log_text.style.color = "lightgreen"; // プレイヤーのセリフのスタイルを変更

                name_tag_flg = false
            }
        } else { // キャラクターのセリフの場合
            log_text_box.appendChild(log_text);
            log_name_tag.textContent = character_name; // ネームタグにキャラクター名を入れる
        }

        let log_sidebar_text = document.getElementById("log_sidebar_text"); // 作成した<div>要素と<p>要素を配置する親要素を取得
        log_sidebar_text.appendChild(log_text_box); // ログにテキストボックスを配置
    }
    narration_flg = false;
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
                log_icon.src = "../img/icon/log_cancel.svg";
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
            log_icon.src = "../img/icon/log_button_icon.svg";
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
function option_display(passed_option_text, option1, option2) {
    let text_window = document.getElementById("text_window"); // テキストウィンドウを取得
    let option = document.getElementById("option"); // 選択肢を取得
    let option_text1 = document.getElementById("option_text1"); // 一つ目の選択肢を取得
    let option_text2 = document.getElementById("option_text2"); // 二つ目の選択肢を取得
    let current_text = document.getElementById("current_text"); // 現在のテキストを取得

    let option_text_list = [passed_option_text];
    let option_text = [option1, option2]; // 選択肢のテキスト

    text_window.style.display = "block"; // テキストウィンドウのdisplayをflexからblockに変更
    current_text.className = "current_text_option"; // 表示されているテキストを選択肢バージョンに変更

    // 選択肢にテキストを挿入する
    option_text1.textContent = option_text[0];
    option_text2.textContent = option_text[1];

    player_text_flg = true;
    setTimeout(() => {
        document.getElementById("character_img_box").className = "character_img_box_option" // キャラクターコンテナのクラスを変更
        async function option_text_display() {
            if (!direct_option_flg) {
                await show_text(text_division(option_text_list)) // テキストを次に進める
            }
            setTimeout(() => {
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
    let option_box1 = document.getElementById("option_box1");
    let option_box2 = document.getElementById("option_box2");
    let option_text_addition = "＞";
    let passed_text_list = [];

    if (option_flg) {
        next_text_sound.play(); // mp3ファイルを再生
        option_selected_flg = true;
        name_tag_flg = true;

        if (num == 1) {
            option1_flg = true;

            if (root_list.Kitamura_root_flg) {
                if (next_text_num == 27) { // 好感度の変化
                    favourable_impression += 20;
                    Kitamura_img();
                } else if (next_text_num == 31) {
                    favourable_impression += 20;
                    Kitamura_img();
                }
            } else if (root_list.Hashidume_root_flg) {
                if (next_text_num == 36) {
                    option_selected(false);
                } else if (next_text_num == 55) {
                    favourable_impression -= 20;
                } else if (next_text_num == 67) {
                    favourable_impression += 10;
                    option_selected(false);
                }
            } else if (root_list.Komatsu_root_flg) {
                if (next_text_num == 24) {
                    favourable_impression += 20;
                } else if (next_text_num == 27) {
                    favourable_impression += 10;
                }
            } else if (root_list.Hukaya_root_flg) {
                if (next_text_num == 27) {
                    favourable_impression += 20;
                } else if (next_text_num == 43) {
                    favourable_impression += 20;
                }
            } else if (root_list.Katura_root_flg) {
                if (next_text_num == 79) {
                    favourable_impression += 10;
                    option_selected(false);
                } else if (next_text_num == 91) {
                    favourable_impression -= 10;
                } else if (next_text_num == 105) {
                    favourable_impression -= 30;
                }
            }

            text_list = [delivery_text_list[0]];
            option_box1.className = "option_box_animation"; // 選択肢のクラスをアニメーションの設定されているクラスに変更
            option_box2.style.display = "none"; // 選択していない選択肢を非表示
            passed_text_list = [document.getElementById("option_text1").textContent];

            show_text(text_division(text_list));
            log_add(passed_text_list, option_text_addition);
        } else {
            option2_flg = true;

            if (root_list.Kitamura_root_flg) {
                if (next_text_num == 25) { // 好感度の変化
                    favourable_impression += 10;
                    Kitamura_img();
                } else if (next_text_num == 31) {
                    favourable_impression -= 30;
                    Kitamura_img();
                } else if (next_text_num == 41) {
                    favourable_impression += 20;
                    Kitamura_img();
                }
            } else if (root_list.Hashidume_root_flg) {
                if (next_text_num == 36) {
                    option_selected(false);
                } else if (next_text_num == 55) {
                    favourable_impression += 20;
                } else if (next_text_num == 67) {
                    favourable_impression -= 10;
                    option_selected(false);
                } else if (next_text_num == 75) {
                    favourable_impression += 10;
                }
            } else if (root_list.Komatsu_root_flg) {
                if (next_text_num == 21) {
                    favourable_impression += 20;
                }
            } else if (root_list.Hukaya_root_flg) {
                if (next_text_num == 27) {
                    favourable_impression -= 10;
                } else if (next_text_num == 43) {
                    favourable_impression += 20;
                }
            } else if (root_list.Katura_root_flg) {
                if (next_text_num == 79) {
                    favourable_impression += 20;
                    option_selected(false);
                } else if (next_text_num == 91) {
                    favourable_impression += 20;
                }
            }

            text_list = [delivery_text_list[1]];
            option_box2.className = "option_box_animation"; // 選択肢のクラスをアニメーションの設定されているクラスに変更
            option_box1.style.display = "none"; // 選択していない選択肢を非表示

            passed_text_list = [document.getElementById("option_text2").textContent];
            show_text(text_division(text_list));
            log_add(passed_text_list, option_text_addition);
        }

        setTimeout(() => {
            document.getElementById("option").style.display = "none"; // 選択肢を遅延して非表示
        }, 750);
    
        direct_option_flg = false;
        player_text_flg = false;
        option_flg = false;
    }
}

// キタムラルートのみキャラ画像の変遷
function Kitamura_img() {
    let Kitamura_img_url = "../img/character/Kitamura/Kitamura_";
    let Kitamura_img = document.getElementById("character_img").src;

    Kitamura_img = `${Kitamura_img_url + String(favourable_impression)}%25.png`;
    document.getElementById("character_img").src = Kitamura_img;

    delivery_img = Kitamura_img;
}

// ハシヅメルートのみネームタグの変更タイミング調整
function option_selected(bool) {
    if (bool) {
        name_tag.textContent = player_name;
    } else {
        name_tag.textContent = character_name;
    }
}