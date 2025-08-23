// mp3ファイルを読み込み
const nextTextSound = new Audio("../audio/next_button.mp3");
const logCloseSound = new Audio("../audio/log_close_button.mp3");
const gameStartSound = new Audio("../audio/game_start.mp3");

// 各処理の切り替えフラグ
let firstNextButtonAnimation = true; // 次へボタンのアニメーションの切り替え
let textDisplayFlg = false; // 次へボタンの関数の実行切り替え
let logSidebarFlg = false // サイドバーの表示切り替え
let nameTagFlg = false; // ネームタグの表示切り替え
let logAnimationFlg = false; // ログの処理実行切り替え
let logNextFlg = false; // ログを開いている間のEnterキー実行切り替え
let optionFlg = false; // 選択肢の処理実行切り替え
let playerTextFlg = false; // ログに追加するテキストの切り替え
let optionSelectedFlg = false; // 選択肢を選択した時のフラグ
let textSkipFlg = false; // テキストをキャンセルするためのフラグ
let narrationFlg = false; // ナレーションなどのセリフ切り替えフラグ
let namelessFlg = false; // プレイヤー、キャラクター以外のセリフ切り替えフラグ
let loadingFlg = false; // ローディング処理の切り替えフラグ
let directOptionFlg = false; // 選択肢のテキスト切り替えフラグ
let endFlg = false; // ゲーム終了の切り替えフラグ
let gameStartFlg = false; // ゲームスタートの切り替えフラグ

// 選択肢の切り替えフラグ
let option1Flg = false;
let option2Flg = false;

const nameTag = document.getElementById("nameTag_h1"); // ネームタグをグローバルで宣言
const characterImage = document.getElementById("characterImage"); // キャラクターの画像をグローバルで宣言

const characterName = localStorage.getItem("characterName"); //ローカルストレージから取得したキャラクター名をグローバルで宣言
const playerName = localStorage.getItem("playerName"); //ローカルストレージから取得したプレイヤー名をグローバルで宣言

const currentText = document.getElementById("currentText"); // 現在のテキストを取得
let currentIndex = 0;
let nextTextNum = 0; // 表示するテキストのリスト番号
let favourableImpression = 50; // 好感度
let firstPerson = localStorage.getItem("gender"); // 一人称

// ページのURLを取得
const url = location.href;

// 各ルートの切り替えフラグ
let rootList = {
    kitamuraRootFlg: true,
    hukayaRootFlg: true,
    komatsuRootFlg: true,
    hashidumeRootFlg: true,
    katuraRootFlg: true,
}

let deliveryTextList = [];
let deliveryImage = "";

// index.htmlのみ有効
if (url == "file:///Users/User/Documents/vantan%202024/simulation_game/template/index.html") {
    // Keydownイベント
    document.addEventListener("keydown", function(event) {
        if (optionFlg && !logSidebarFlg) { // 選択肢が表示されている時のみ有効
            if (event.key == "1" || event.key == "2") {
                option(Number(event.key));
                nextTextSound.play(); // mp3ファイルを再生
            }
        } else {
            if (event.key == "Enter" && textDisplayFlg && !logNextFlg) {
                nextText(event);
            }
        }

        // Escapeキーを押すとログを表示
        if (event.key == "Escape") {
            logAnimation();
        }
    });

    // 一番最初に表示されるセリフ
    window.onload = () => {
        const loading = document.getElementById("loading");
        const nextTagBox = document.getElementById("nameTag");
        let textList = [];
        loading.className = "first_loading";

        setTimeout(() => {
            document.getElementById("main_box").style.display = "block";

            loading.className = "loading";
            loading.style.zIndex = 50;
            loading.style.opacity = 0;
            nameTag.textContent = playerName; // ネームタグにプレイヤー名を挿入

            if (characterName == "キタムラ") { // 喜多村さんルート
                for (let key in rootList) {
                    if (key !== "kitamuraRootFlg") {
                        rootList[key] = !rootList[key];
                        localStorage.setItem("characterRoot", "Kitamura");
                    }
                }
                textList = ["今日から念願の初出勤！どんな人がいるのか楽しみだなあ"];

            } else if (characterName == "フカヤ") { // 深谷さんルート
                for (let key in rootList) {
                    if (key !== "hukayaRootFlg") {
                        rootList[key] = !rootList[key];
                        localStorage.setItem("characterRoot", "Hukaya");
                    }
                }
                document.getElementById("nameTag").style.display = "none";
                narrationFlg = true;
                textList = ["〜バンタン 2階〜"];

            } else if (characterName == "コマツ") { // 小松さんルート
                for (let key in rootList) {
                    if (key !== "komatsuRootFlg") {
                        rootList[key] = !rootList[key];
                        localStorage.setItem("characterRoot", "Komatsu");
                    }
                }
                textList = ["おはようございます！初めまして！"];

            } else if (characterName == "ハシヅメ") { // 橋爪さんルート
                for (let key in rootList) {
                    if (key !== "hashidumeRootFlg") {
                        rootList[key] = !rootList[key];
                        localStorage.setItem("characterRoot", "Hashidume");
                    }
                }
                textList = ["バンタンの職員として今日は初めての出勤日！遅刻しないように早く行かなきゃ…"];

            } else if (characterName == "カツラ") { // 桂さんルート
                for (let key in rootList) {
                    if (key !== "katuraRootFlg") {
                        rootList[key] = !rootList[key];
                        localStorage.setItem("characterRoot", "Katura");
                    }
                }
                nextTagBox.style.display = "none";
                textList = ["〜バンタン 2階〜"];
            }

            firstNextButtonAnimation = false;
            nameTagFlg = true;
            
            setTimeout(() => {
                showText(textDivision(textList));
            }, 750);
            setTimeout(() => {
                loading.style.display = "none";
            }, 3000);
            nextTextNum += 1; // テキストのリスト番号を一つ進める
            console.log(`*最初のセリフ (現在のテキスト番号 : ${nextTextNum})`); // 現在のテキスト番号 (デバッグ用)
        }, 1000);
    }
}

// title.htmlのみ有効
if (url == "file:///Users/User/Documents/vantan%202024/simulation_game/template/title.html") {
    window.onload = () => {
        // ローカルストーレジから各要素を削除
        localStorage.removeItem("playerName", "favourableImpression", "characterName", "gender");

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
    document.getElementById("playerName_input").addEventListener("keydown", (event) => { // Enterキーが入力されたら変数にプレイヤー名を格納
        if (event.key == "Enter") {
            event.preventDefault(); // フォームの送信を防ぐ

            let playerName = document.getElementById("playerName_input").value;
            localStorage.setItem("playerName", playerName); // プレイヤー名をローカルストレージに保存(ページが遷移される際に変数が初期化されるため)

            document.getElementById("playerName_text").textContent =`あなたの名前は、${playerName}です。(現在の文字数 : ${playerName.length}文字)`;
        }
    });

    document.addEventListener("keydown", (event) => {
        if (event.key == "Enter" && !gameStartFlg) {
            enterHidden();
            gameStartFlg = true;
        }
    });
}

// ending.htmlのみ有効
if (url == "file:///Users/User/Documents/vantan%202024/simulation_game/template/ending.html") {
    window.onload = () => {
        const loading = document.getElementById("loading");
        const favourableImpression = localStorage.getItem("favourableImpression");
        const characterRoot = localStorage.getItem("characterRoot");
        const endingCharacterImage = document.getElementById("endingCharacterImage");

        let endingTitle = document.getElementById("ending_h1");
        let endingText1 = document.getElementById("endingText1");
        let endingText2 = document.getElementById("endingText2");
        let endingText3 = document.getElementById("endingText3");

        loading.className = "first_loading";        
        if (favourableImpression > 60) {
            endingTitle.textContent = "攻略成功";
            endingText1.textContent = "〜大変よくできました〜"
            endingText2.textContent = `好感度 { ${favourableImpression} }`;
            endingText3.textContent = "これであなたも立派なバンタンスタッフです！";

            if (characterRoot == "Kitamura") {
                endingCharacterImage.src = "../img/character/Kitamura/Kitamura_3.png";
            } else if (characterRoot == "Hukaya") {
                endingCharacterImage.src = "../img/character/Hukaya/Hukaya_3.png";
            } else if (characterRoot == "Komatsu") {
                endingCharacterImage.src = "../img/character/Komatsu/Komatsu_3.png";
            } else if (characterRoot == "Hashidume") {
                endingCharacterImage.src = "../img/character/Hashidume/Hashidume_3.png";
            } else if (characterRoot == "Katura") {
                endingCharacterImage.src = "../img/character/Katura/Katura_6.png";
            }
            
        } else if (favourableImpression > 40) {
            endingTitle.textContent = "攻略成功";
            endingText1.textContent = "〜よくできました〜"
            endingText2.textContent = `好感度 { ${favourableImpression} }`;
            endingText3.textContent = "より良い結果を目指してもう一度チャレンジしてみましょう！";

            if (characterRoot == "Kitamura") {
                endingCharacterImage.src = "../img/character/Kitamura/Kitamura_4.png";
            } else if (characterRoot == "Hukaya") {
                endingCharacterImage.src = "../img/character/Hukaya/Hukaya_2.png";
            } else if (characterRoot == "Komatsu") {
                endingCharacterImage.src = "../img/character/Komatsu/Komatsu_2.png";
            } else if (characterRoot == "Hashidume") {
                endingCharacterImage.src = "../img/character/Hashidume/Hashidume_2.png";
            } else if (characterRoot == "Katura") {
                endingCharacterImage.src = "../img/character/Katura/Katura_2.png";
            }

        } else if (favourableImpression <= 40) {
            endingTitle.textContent = "攻略失敗";
            endingText1.textContent = "〜がんばりましょう〜";
            endingText2.textContent = `好感度 { ${favourableImpression} }`;
            endingText3.textContent = "次はもっと良い結果になると良いですね！";

            if (characterRoot == "Kitamura") {
                endingCharacterImage.src = "../img/character/Kitamura/Kitamura_2.png";
            } else if (characterRoot == "Hukaya") {
                endingCharacterImage.src = "../img/character/Hukaya/Hukaya_4.png";
            } else if (characterRoot == "Komatsu") {
                endingCharacterImage.src = "../img/character/Komatsu/Komatsu_5.png";
            } else if (characterRoot == "Hashidume") {
                endingCharacterImage.src = "../img/character/Hashidume/Hashidume_4.png";
            } else if (characterRoot == "Katura") {
                endingCharacterImage.src = "../img/character/Katura/Katura_5.png";
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

    document.getElementById("optionBox1").addEventListener("click", (event) => {
        gameStartSound.play();
        event.preventDefault(); // ページ遷移を一時停止
        
        const url = this.parentElement.href; // ページのURLを取得
        const loading = document.getElementById("loading");
        loading.style.display = "block";
    
        loadingDisplay().then(() => {
            window.location = url; // resolveが返されたらURLを変更してページを遷移
        });
    
        function loadingDisplay() {
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
    
    document.getElementById("optionBox2").addEventListener("click", function(event) {
        gameStartSound.play();
        event.preventDefault(); // ページ遷移を一時停止

        const url = this.parentElement.href; // ページのURLを取得
        const loading = document.getElementById("loading");
        loading.style.display = "block";
    
        loadingDisplay().then(() => {
            window.location = url; // resolveが返されたらURLを変更してページを遷移
        });
    
        function loadingDisplay() {
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
            endingOption(event.key);
        } else if (event.key == "2") {
            endingOption(event.key);
        }
    })
}

// エンディングの選択肢
function endingOption(num) {
    gameStartSound.play();
    let optionBox1 = document.getElementById("optionBox1");
    let optionBox2 = document.getElementById("optionBox2");

    if (num == 1) {
        optionBox1.className = "optionBox_animation"; // 選択肢のクラスをアニメーションの設定されているクラスに変更

        const url = "title.html"; // ページのURLを取得
        const loading = document.getElementById("loading");

        loading.style.display = "block";
        loading.style.backgroundColor = "#fff";
        
        loadingDisplay().then(() => {
            window.location = url; // resolveが返されたらURLを変更してページを遷移
        });
        
        function loadingDisplay() {
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
        optionBox2.className = "optionBox_animation"; // 選択肢のクラスをアニメーションの設定されているクラスに変更

        const url = "end_roll.html"; // ページのURLを取得
        const loading = document.getElementById("loading");

        loading.style.display = "block";
        loading.style.backgroundColor = "#111";
        
        loadingDisplay().then(() => {
            window.location = url; // resolveが返されたらURLを変更してページを遷移
        });
        
        function loadingDisplay() {
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

function enterHidden() {
    gameStartSound.play();

    document.getElementById("Enter_hidden").style.display = "none";
    document.getElementById("playerName_input").style.display = "block";
    document.getElementById("name_button").style.display = "block";
}

function nameSubmit() {
    const nameInput = document.getElementById("playerName_input").value;

    if (nameInput == "") {
        alert("名無しさんはプレイできません！");
    } else {
        confirm(`あなたの名前は「${nameInput}」です。よろしいですか？`);
        localStorage.setItem("playerName", nameInput); // プレイヤー名をローカルストレージに保存(ページが遷移される際に変数が初期化されるため)

        const gender_option = document.getElementById("gender_optionBox");

        gender_option.style.display = "block";
    }
}

// キャラクターを選択
function characterSelect(characterName) {
    confirm(characterName + "ルートを開始します。よろしいですか？");
    localStorage.setItem("characterName", characterName); // キャラクター名をローカルストレージに保存

    const url = "index.html"; // ページのURLを取得
    const loading = document.getElementById("loading");

    loadingDisplay().then(() => {
        window.location = url; // resolveが返されたらURLを変更してページを遷移
    });

    function loadingDisplay() {
        return new Promise(async (resolve) => {
            loading.style.zIndex = 50;
            loading.style.opacity = 1;

            setTimeout(() => {
                resolve(); // resolveを遅延して返す
            }, 1500);
        });
    }
}

function genderSelect(num) {
    if (num == 1) {
        confirm("男の子でプレイします。よろしいですか？");
        localStorage.setItem("gender", "僕")
    } else {
        confirm("女の子でプレイします。よろしいですか？");
        localStorage.setItem("gender", "私");
    }

    document.getElementById("character_optionBox").style.display = "flex";
    document.getElementById("gender_optionBox").style.display = "none";
    document.getElementById("first_title").style.display = "none";
    document.getElementById("title_body").style.background = "#fff";
}

// テキストを分割
function textDivision(passedTextList) {
    let nextText = passedTextList[0];
    document.getElementById("currentText").innerHTML = ""; // 現在のテキストを初期化

    textList = []; // リストをリセット
    textList = [...nextText]; // 新しいテキストを分割

    return textList; // 分割したテキストを返す
}

// 次へボタンを押した時の処理
async function nextText() {
    let currentText = document.getElementById("currentText"); // 現在のテキストを取得

    if (textDisplayFlg == true) {
        let nextButton = document.getElementById("next_button"); // 次へボタンを取得
        let nextTagBox = document.getElementById("nameTag"); // ネームタグを取得
        let textList = [];

        textSkipFlg = false;
        textDisplayFlg = false;
        firstNextButtonAnimation = false; // 関数が実行されたらアニメーションのリピートを停止

        nextTextSound.play(); // mp3ファイルを再生
        nextTextNum += 1; // テキストのリスト番号を一つ進める

        if (nextTextNum == 2) {

            if (rootList.kitamuraRootFlg) {
                unDirectOptionFlg();

                nextTagBox.style.display = "none"; // ネームタグを非表示
                narrationFlg = true;

                textList = ["〜バンタン2階〜"];
                nextTextShow();
            } else if (rootList.hashidumeRootFlg) {
                unDirectOptionFlg();

                nextTagBox.style.display = "block";
                narrationFlg = true;

                textList = ["～バンタン2階～"];
                nextTextShow();
            } else if (rootList.komatsuRootFlg) {
                unDirectOptionFlg();

                characterImage.src = "../img/character/Komatsu/Komatsu_1.png";
                characterImage.style.padding = "0";
                nameTag.textContent = characterName;
                textList = ["にょっす！！"];

                nextTextShow();
            } else if (rootList.hukayaRootFlg) {
                unDirectOptionFlg();

                characterImage.src = "../img/character/Hashidume/Hashidume_1.png";
                characterImage.style.padding = "0";

                nextTagBox.style.display = "block";
                nameTag.textContent = "ハシヅメ";
                namelessFlg = true;

                textList = ["今日から一年間よろしくお願いします！"];
                nextTextShow();
            } else if (rootList.katuraRootFlg) {
                unDirectOptionFlg();

                nextTagBox.style.display = "block";
                nameTag.textContent = playerName;
                nameTagFlg = true;

                textList = ["おはようございます！"];
                nextTextShow();
            }
            
        } else if (nextTextNum == 3) {

            if (rootList.kitamuraRootFlg) {
                unDirectOptionFlg();
            
                nextTagBox.style.display = "block"; // ネームタグを表示

                textList = ["おはようございます！初めまして！"];
                nameTagFlg = true
                nextTextShow();
            } else if (rootList.hashidumeRootFlg) {
                unDirectOptionFlg();

                nextTagBox.style.display = "block";
                nameTagFlg = true;

                textList = ["おはようございます！初めまして！"];
                nextTextShow();
            } else if (rootList.komatsuRootFlg) {
                unDirectOptionFlg();

                nameTag.textContent = playerName;
                nameTagFlg = true;

                textList = ["今日からよろしくお願いします！いきなりなんですけど、コマツさんの授業見学しても良いですか？"];
                nextTextShow();
            } else if (rootList.hukayaRootFlg) {
                unDirectOptionFlg();

                nameTag.textContent = playerName;
                nameTagFlg = true;

                textList = ["こちらこそ、よろしくお願いします"];
                nextTextShow();
            } else if (rootList.katuraRootFlg) {
                unDirectOptionFlg();

                characterImage.src = "../img/character/Katura/Katura_1.png";
                nameTag.textContent = characterName;
                textList = [`おはようございます〜。新任スタッフの${playerName}さん?`];

                nextTextShow();
            }
            
        } else if (nextTextNum == 4) {

            if (rootList.kitamuraRootFlg) {
                unDirectOptionFlg();

                nameTag.textContent = characterName;
                characterImage.src = "../img/character/Kitamura/Kitamura_50%.png";
                characterImage.style.padding = "0";

                textList = ["おはやざっす。初めまして、今日からっすか？"];
                nextTextShow();
            } else if (rootList.hashidumeRootFlg) {
                unDirectOptionFlg();

                nameTag.textContent = characterName;
                characterImage.src = "../img/character/Hashidume/Hashidume_1.png";
                characterImage.style.padding = "0";

                textList = [`おはようございます！！君が今日からスタッフとして一緒に働く${playerName}さんかな？よろしく！！`]
                nextTextShow();
            } else if (rootList.komatsuRootFlg) {
                unDirectOptionFlg();

                nameTag.textContent = characterName;
                textList = ["あー別に構わないですけど"];

                nextTextShow();
            } else if (rootList.hukayaRootFlg) {
                unDirectOptionFlg();

                nameTag.textContent = "ハシヅメ";
                namelessFlg = true;

                textList = ["早速ですが、504教室のフカヤ講師の授業に参加お願いします！"];
                nextTextShow();
            } else if (rootList.katuraRootFlg) {
                unDirectOptionFlg();

                nameTag.textContent = playerName;
                namelessFlg = true;

                textList = [`はい！${playerName}です！`];
                nextTextShow();
            }

        } else if(nextTextNum == 5) {

            if (rootList.kitamuraRootFlg) {
                unDirectOptionFlg();
                nameTag.textContent = playerName;

                textList = ["はい！初めてなので授業見学させていただいてもよろしいでしょうか？"];
                nameTagFlg = true
                nextTextShow();
            } else if (rootList.hashidumeRootFlg) {
                unDirectOptionFlg();

                nameTag.textContent = playerName;
                nameTagFlg = true;
                textList = ["あの、スタッフって何するか分からないので授業の見学をしたいのですが、よろしいでしょうか？"];
                nextTextShow();
            } else if (rootList.komatsuRootFlg) {
                unDirectOptionFlg();

                characterImage.src = "#";
                nextTagBox.style.display = "none";
                narrationFlg = true;

                textList = ["〜4階 402教室〜"];
                loadingFlg = true;
                nextTextShow();
                loading();

                loading().then(() => {
                    setTimeout(() => {
                        document.getElementById("loading").style.display = "none";
                        loadingFlg = false;
                    }, 1500);
                });
            } else if (rootList.hukayaRootFlg) {
                unDirectOptionFlg();

                nameTag.textContent = playerName;
                nameTagFlg = true;

                textList = ["分かりました"];
                nextTextShow();
            } else if (rootList.katuraRootFlg) {
                unDirectOptionFlg();

                nameTag.textContent = characterName;
                textList = ["僕が今日ここを案内させていただく「カツラ」と申します"];

                nextTextShow();
            }
            
        } else if(nextTextNum == 6) {

            if (rootList.kitamuraRootFlg) {
                unDirectOptionFlg();

                nameTag.textContent = characterName;
                textList = ["あぁ、全然いいっすよ！"];
                nextTextShow();
            } else if (rootList.hashidumeRootFlg) {
                unDirectOptionFlg();

                nameTag.textContent = characterName;
                textList = ["ん〜そうだね、多分緊張もしてるだろうからリラックスも兼ねて僕と一緒に見て回ろうか"];
                nextTextShow();
            } else if (rootList.komatsuRootFlg) {
                unDirectOptionFlg();

                characterImage.src = "../img/character/Komatsu/Komatsu_4.png";
                nextTagBox.style.display = "block";
                nameTag.textContent = characterName;

                textList = ["これちゃんと写してね！これ今のうちにやっとかないとガチで次詰むからね！！"];
                nextTextShow();
            } else if (rootList.hukayaRootFlg) {
                unDirectOptionFlg();

                characterImage.src = "#";
                nextTagBox.style.display = "none";
                narrationFlg = true;

                textList = ["〜5階 504教室〜"];
                loadingFlg = true;
                nextTextShow();
                loading();

                loading().then(() => {
                    setTimeout(() => {
                        document.getElementById("loading").style.display = "none";
                        loadingFlg = false;
                    }, 1500);
                });
            } else if (rootList.katuraRootFlg) {
                unDirectOptionFlg();

                nameTag.textContent = playerName;
                nameTagFlg = true;

                textList = ["今日はよろしくお願いします！"];
                nextTextShow();
            }

        } else if (nextTextNum == 7) {

            if (rootList.kitamuraRootFlg) {
                unDirectOptionFlg();
                
                characterImage.src = "#";
                nextTagBox.style.display = "none";
                narrationFlg = true;

                textList = ["〜5階 503教室〜"];
                loadingFlg = true;
                nextTextShow();
                loading();

                loading().then(() => {
                    setTimeout(() => {
                        document.getElementById("loading").style.display = "none";
                        loadingFlg = false;
                    }, 1500);
                });
            } else if (rootList.hashidumeRootFlg) {
                unDirectOptionFlg();

                nameTag.textContent = playerName;
                nameTagFlg = true;
                textList = ["良いんですか！ありがとうございます！"];

                nextTextShow();
            } else if (rootList.komatsuRootFlg) {
                unDirectOptionFlg();

                nameTag.textContent = playerName;
                nameTagFlg = true;

                textList = ["この先生はこんな感じなんだ〜"];
                nextTextShow();
            } else if (rootList.hukayaRootFlg) {
                unDirectOptionFlg();

                characterImage.src = "../img/character/Hukaya/Hukaya_1.png";
                nameTag.textContent = characterName;
                nextTagBox.style.display = "block";

                textList = ["ITパスポート試験対策講座の担当講師・フカヤです。よろしくお願いします！"];
                nextTextShow();
            } else if (rootList.katuraRootFlg) {
                unDirectOptionFlg();

                nameTag.textContent = characterName;
                textList = ["申し訳ないんですけど、実は急遽ガイダンスが入ってしまって。"];

                nextTextShow();
            }

        } else if (nextTextNum == 8) {

            if (rootList.kitamuraRootFlg) {
                unDirectOptionFlg();

                characterImage.src = "../img/character/Kitamura/Kitamura_4.png";
                characterImage.style.padding = "50px 0 0 0";
                nextTagBox.style.display = "block";

                textList = ["うぇ！？マジッすか！？んなことあったんすか！マジそれやばくねぇー！？"];
                nextTextShow();
            } else if (rootList.hashidumeRootFlg) {
                unDirectOptionFlg();

                nameTag.textContent = characterName;
                textList = ["それじゃあ行こっか"];
                nextTextShow();
            } else if (rootList.komatsuRootFlg) {
                unDirectOptionFlg();

                characterImage.src = "#";
                nextTagBox.style.display = "none";
                narrationFlg = true;

                textList = ["〜授業後〜"];
                loadingFlg = true;
                nextTextShow();
                loading();

                loading().then(() => {
                    setTimeout(() => {
                        document.getElementById("loading").style.display = "none";
                        loadingFlg = false;
                    }, 1500);
                });
            } else if (rootList.hukayaRootFlg) {
                unDirectOptionFlg();

                nameTag.textContent = playerName;
                nameTagFlg = true;

                textList = [`今日から一年間お世話になります、${playerName}と言います。よろしくお願いします`];
                nextTextShow();
            } else if (rootList.katuraRootFlg) {
                unDirectOptionFlg();

                textList = ["せっかくなので見て行きますか？"];
                nextTextShow();
            }

        } else if (nextTextNum == 9) {

            if (rootList.kitamuraRootFlg) {
                unDirectOptionFlg();

                nameTag.textContent = "生徒A";
                namelessFlg = true;
                
                textList = ["そうなんすよ！"];
                nextTextShow();
            } else if (rootList.hashidumeRootFlg) {
                unDirectOptionFlg();

                characterImage.src = "#";
                nextTagBox.style.display = "none";
                narrationFlg = true;

                textList = ["～4階 402教室～"];
                loadingFlg = true;
                nextTextShow();
                loading();

                loading().then(() => {
                    setTimeout(() => {
                        document.getElementById("loading").style.display = "none";
                        loadingFlg = false;
                    }, 1500);
                });
            } else if (rootList.komatsuRootFlg) {
                unDirectOptionFlg();

                nextTagBox.style.display = "block";
                nameTag.textContent = playerName;
                nameTagFlg = true;

                textList = ["授業お疲れ様でした"];
                nextTextShow();
            } else if (rootList.hukayaRootFlg) {
                unDirectOptionFlg();

                nameTagFlg = true;
                textList = ["早速一つ質問なんですけど、ITパスポートってどういうものなんですか？"];

                nextTextShow();
            } else if (rootList.katuraRootFlg) {
                unDirectOptionFlg();

                nameTag.textContent = playerName;
                nameTagFlg = true;

                textList = ["はい！ガイダンスの方見学させて頂きたいです！"];
                nextTextShow();
            }

        } else if (nextTextNum == 10) {

            if (rootList.kitamuraRootFlg) {
                unDirectOptionFlg();
                nameTag.textContent = playerName;

                textList = ["この先生はこんな感じなのか〜"];
                nameTagFlg = true
                nextTextShow();
            } else if (rootList.hashidumeRootFlg) {
                unDirectOptionFlg();

                nextTagBox.style.display = "block";
                nameTag.textContent = "コマツ";
                namelessFlg = true;

                textList = ["この問題の答えは～…"];
                nextTextShow();
            } else if (rootList.komatsuRootFlg) {
                unDirectOptionFlg();

                characterImage.src = "../img/character/Komatsu/Komatsu_1.png";
                nameTag.textContent = characterName;
                
                textList = ["お疲れ様でした、どうでした僕の授業は？"];
                nextTextShow();
            } else if (rootList.hukayaRootFlg) {
                unDirectOptionFlg();

                nameTag.textContent = characterName;
                textList = ["ITパスポートはですね、ITの基礎分野を詰め込んだ資格です。"];

                nextTextShow();
            } else if (rootList.katuraRootFlg) {
                unDirectOptionFlg();

                nameTag.textContent = characterName;
                textList = ["了解です。では4階に向かいましょうか。"];

                nextTextShow();
            }

        } else if (nextTextNum == 11) {
            
            if (rootList.kitamuraRootFlg) {
                unDirectOptionFlg();

                characterImage.src = "#";
                nextTagBox.style.display = "none";
                narrationFlg = true;

                textList = ["〜授業後〜"];
                loadingFlg = true;
                nextTextShow();
                loading();

                loading().then(() => {
                    setTimeout(() => {
                        document.getElementById("loading").style.display = "none";
                    }, 1500);
                    loadingFlg = false;
                });
            } else if (rootList.hashidumeRootFlg) {
                unDirectOptionFlg();

                nameTag.textContent = "生徒達";
                namelessFlg = true;

                textList = ["がやがや"];
                nextTextShow();
            } else if (rootList.komatsuRootFlg) {
                unDirectOptionFlg();

                nameTag.textContent = playerName;
                nameTagFlg = true;

                textList = ["話が分かりやすくって面白かったです！"];
                nextTextShow();
            } else if (rootList.hukayaRootFlg) {
                unDirectOptionFlg();

                textList = [`この授業では、資格を取得するための勉強方法や、実際の試験での進め方をサポートしていきます。`];
                nextTextShow();
            } else if (rootList.katuraRootFlg) {
                unDirectOptionFlg();

                characterImage.src = "#";
                nextTagBox.style.display = "none";
                narrationFlg = true;

                textList = ["〜4階 403教室〜"];
                loadingFlg = true;
                nextTextShow();
                loading();

                loading().then(() => {
                    setTimeout(() => {
                        document.getElementById("loading").style.display = "none";
                    }, 1500);
                    loadingFlg = false;
                });
            }

        } else if (nextTextNum == 12) {

            if (rootList.kitamuraRootFlg) {
                unDirectOptionFlg();

                nextTagBox.style.display = "block";
                nameTag.textContent = playerName;

                textList = ["授業お疲れ様でした"];
                nameTagFlg = true
                nextTextShow();
            } else if (rootList.hashidumeRootFlg) {
                unDirectOptionFlg();

                nameTag.textContent = playerName;
                nameTagFlg = true;

                textList = ["わぁ～すごい！本格的な授業ですね！"];
                nextTextShow();
            } else if (rootList.komatsuRootFlg) {
                unDirectOptionFlg();

                nameTag.textContent = characterName;
                textList = ["あ〜ならよかったです（照///）"];

                nextTextShow();
            } else if (rootList.hukayaRootFlg) {
                unDirectOptionFlg();

                nameTag.textContent = playerName;
                nameTagFlg = true;

                textList = ["なるほど〜"];
                nextTextShow();
            } else if (rootList.katuraRootFlg) {
                unDirectOptionFlg();

                characterImage.src = "../img/character/Katura/Katura_1.png";
                nextTagBox.style.display = "block";
                nameTag.textContent = characterName;

                textList = ["着きました。ガイダンスは403教室で行いますので"];
                nextTextShow();
            }

        } else if (nextTextNum == 13) {

            if (rootList.kitamuraRootFlg) {
                unDirectOptionFlg();

                characterImage.src = "../img/character/Kitamura/Kitamura_50%.png";
                characterImage.style.padding = "0";
                nameTag.textContent = characterName;

                textList = ["お疲れっす、どうでしたか僕の授業は？"];
                nextTextShow();
            } else if (rootList.hashidumeRootFlg) {
                unDirectOptionFlg();

                characterImage.src = "../img/character/Hashidume/Hashidume_1.png";
                nameTag.textContent = characterName;

                textList = ["僕たちの仕事は授業スケジュールを組んだり、生徒たちのサポートをするんだよ"];
                nextTextShow();
            } else if (rootList.komatsuRootFlg) {
                unDirectOptionFlg();

                nameTag.textContent = playerName;
                nameTagFlg = true;

                textList = ["そういえば三ヶ月後クリスマスですね！！"];
                nextTextShow();
            } else if (rootList.hukayaRootFlg) {
                unDirectOptionFlg();

                characterImage.src = "#";
                nextTagBox.style.display = "none";
                narrationFlg = true;

                textList = ["〜授業後〜"];
                loadingFlg = true;
                nextTextShow();
                loading();

                loading().then(() => {
                    setTimeout(() => {
                        document.getElementById("loading").style.display = "none";
                    }, 1500);
                    loadingFlg = false;
                });
            } else if (rootList.katuraRootFlg) {
                unDirectOptionFlg();

                characterImage.src = "../img/character/Hashidume/Hashidume_3.png";
                nameTag.textContent = "ハシヅメ";
                namelessFlg = true;

                textList = ["あ、きたきた。カツラさん出席確認はしといたんで、後よろしくお願いします。"];
                nextTextShow();
            }

        } else if (nextTextNum == 14) {

            if (rootList.kitamuraRootFlg) {
                unDirectOptionFlg();
                nameTag.textContent = playerName;

                textList = ["話が分かりやすくって面白かったです！"];
                nameTagFlg = true;
                nextTextShow();
            } else if (rootList.hashidumeRootFlg) {
                unDirectOptionFlg();

                nameTag.textContent = playerName;
                nameTagFlg = true;

                textList = ["生徒たちのサポート？"];
                nextTextShow();
            } else if (rootList.komatsuRootFlg) {
                unDirectOptionFlg();

                nameTag.textContent = characterName;
                textList = ["あ〜もうそんな時期かあ"];

                nextTextShow();
            } else if (rootList.hukayaRootFlg) {
                unDirectOptionFlg();

                characterImage.src = "../img/character/Hukaya/Hukaya_1.png";
                nextTagBox.style.display = "block";
                nameTag.textContent = characterName;

                textList = ["今日の授業はどうでしたか？"];
                nextTextShow();
            } else if (rootList.katuraRootFlg) {
                unDirectOptionFlg();

                characterImage.src = "../img/character/Katura/Katura_2.png";
                nameTag.textContent = characterName;

                textList = ["あれ、面白い事するって言ってませんでした?笑"];
                nextTextShow();
            }

        } else if (nextTextNum == 15) {

            if (rootList.kitamuraRootFlg) {
                unDirectOptionFlg();

                nameTag.textContent = characterName;
                textList = ["本当っすか！それなら良かったっす（照//）"];
                nextTextShow();
            } else if (rootList.hashidumeRootFlg) {
                unDirectOptionFlg();

                characterImage.src = "../img/character/Hashidume/Hashidume_1.png";
                nameTag.textContent = characterName;

                textList = ["そうそう、まぁ元気付けたり、相談に乗ってあげないといけないからね。僕みたいに元気よく接するのもいいよ！"];
                nextTextShow();
            } else if (rootList.komatsuRootFlg) {
                unDirectOptionFlg();

                nameTag.textContent = playerName;
                nameTagFlg = true;

                textList = ["クリスマス楽しみですね！"];
                nextTextShow();
            } else if (rootList.hukayaRootFlg) {
                unDirectOptionFlg();

                nameTag.textContent = playerName;
                nameTagFlg = true;

                textList = ["教科書に沿って問題の解き方を教えてくれて、とても分かりやすくて楽しい授業でした"];
                nextTextShow();
            } else if (rootList.katuraRootFlg) {
                unDirectOptionFlg();

                characterImage.src = "../img/character/Hashidume/Hashidume_1.png";
                nameTag.textContent = "ハシヅメ";
                namelessFlg = true;

                textList = ["いやいや言ってませんよ笑"];
                nextTextShow();
            }

        } else if (nextTextNum == 16) {

            if (rootList.kitamuraRootFlg) {
                unDirectOptionFlg();
                nameTag.textContent = playerName;

                textList = ["今日はありがとうございました"];
                nameTagFlg = true;
                nextTextShow();
            } else if (rootList.hashidumeRootFlg) {
                unDirectOptionFlg();

                nameTag.textContent = playerName;
                nameTagFlg = true;

                textList = ["（橋爪さんって親切で元気があるなぁ）"];
                nextTextShow();
            } else if (rootList.komatsuRootFlg) {
                unDirectOptionFlg();

                nameTag.textContent = characterName;
                textList = ["そうですね〜"];

                nextTextShow();
            } else if (rootList.hukayaRootFlg) {
                unDirectOptionFlg();

                nameTag.textContent = characterName;
                textList = ["そこまで言って頂いて…ありがとうございます"];

                nextTextShow();
            } else if (rootList.katuraRootFlg) {
                unDirectOptionFlg();

                nameTag.textContent = "メンバー";
                namelessFlg = true;

                textList = ["カツラさん来てからやるって言ってましたよ〜！"];
                nextTextShow();
            }

        } else if (nextTextNum == 17) {

            if (rootList.kitamuraRootFlg) {
                unDirectOptionFlg();

                nameTag.textContent = characterName;
                textList = ["またなんかあればいつでも言ってください！"];
                nextTextShow();
            } else if (rootList.hashidumeRootFlg) {
                unDirectOptionFlg();

                characterImage.src = "#";
                nextTagBox.style.display = "none";
                narrationFlg = true;
                loadingFlg = true;

                textList = ["～見学が終わり～"];
                nextTextShow();

                loading();
                loading().then(() => {
                    setTimeout(() => {
                        document.getElementById("loading").style.display = "none";
                    }, 1500);
                    loadingFlg = false;
                });
            } else if (rootList.komatsuRootFlg) {
                unDirectOptionFlg();

                characterImage.src = "#";
                nextTagBox.style.display = "none";
                narrationFlg = true;
                loadingFlg = true;

                textList = ["～3ヶ月後～"];
                nextTextShow();
                logRemove();

                loading();
                loading().then(() => {
                    setTimeout(() => {
                        document.getElementById("loading").style.display = "none";
                    }, 1500);
                    loadingFlg = false;
                });
            } else if (rootList.hukayaRootFlg) {
                unDirectOptionFlg();

                nameTag.textContent = playerName;
                nameTagFlg = true;
                textList = ["また来週もお願いします"];

                nextTextShow();
            } else if (rootList.katuraRootFlg) {
                unDirectOptionFlg();

                nameTag.textContent = "ハシヅメ";
                namelessFlg = true;

                textList = ["おいおいおい笑するって言ってないから笑"];
                nextTextShow();
            }

        } else if (nextTextNum == 18) {

            if (rootList.kitamuraRootFlg) {
                unDirectOptionFlg();
                nameTag.textContent = playerName;

                textList = ["はい！"];
                nameTagFlg = true;
                nextTextShow();
            } else if (rootList.hashidumeRootFlg) {
                unDirectOptionFlg();

                nextTagBox.style.display = "block";
                nameTag.textContent = playerName;
                nameTagFlg = true;

                textList = ["橋爪さん！今日はありがとうございました！"];
                nextTextShow();
            } else if (rootList.komatsuRootFlg) {
                unDirectOptionFlg();

                characterImage.src = "../img/character/Komatsu/Komatsu_1.png";
                nextTagBox.style.display = "block";
                nameTag.textContent = characterName;

                textList = ["おはようございます〜"];
                nextTextShow();
            } else if (rootList.hukayaRootFlg) {
                unDirectOptionFlg();

                characterImage.src = "#";
                nextTagBox.style.display = "none";
                narrationFlg = true;

                loading();
                logRemove();
                loadingFlg = true;

                textList = ["〜半年後〜"];
                nextTextShow();

                loading().then(() => {
                    setTimeout(() => {
                        document.getElementById("loading").style.display = "none";
                    }, 1500);
                    loadingFlg = false;
                });
            } else if (rootList.katuraRootFlg) {
                unDirectOptionFlg();

                characterImage.src = "../img/character/Katura/Katura_1.png";
                nameTag.textContent = characterName;

                textList = ["じゃあ前…よろしくお願いします^^"];
                nextTextShow();
            }

        } else if (nextTextNum == 19) {

            if (rootList.kitamuraRootFlg) {
                unDirectOptionFlg();

                characterImage.src = "#";
                nextTagBox.style.display = "none";
                narrationFlg = true;

                loading();
                logRemove();
                loadingFlg = true;

                textList = ["〜3ヶ月後〜"];
                nextTextShow();

                loading().then(() => {
                    setTimeout(() => {
                        document.getElementById("loading").style.display = "none";
                    }, 1500);
                    loadingFlg = false;
                });
            } else if (rootList.hashidumeRootFlg) {
                unDirectOptionFlg();

                characterImage.src = "../img/character/Hashidume/Hashidume_1.png";
                nameTag.textContent = characterName;

                textList = ["いやいや良いんだよ、これからよろしくね！！"];
                nextTextShow();
            } else if (rootList.komatsuRootFlg) {
                unDirectOptionFlg();

                nameTag.textContent = playerName;
                nameTagFlg = true;

                textList = ["おはようございます！"];
                nextTextShow();
            } else if (rootList.hukayaRootFlg) {
                unDirectOptionFlg();

                characterImage.src = "../img/character/Hukaya/Hukaya_1.png";
                nameTag.textContent = characterName;
                nextTagBox.style.display = "block";

                textList = ["今日もありがとうございました"];
                nextTextShow();
            } else if (rootList.katuraRootFlg) {
                unDirectOptionFlg();

                characterImage.src = "#";
                nextTagBox.style.display = "none";
                narrationFlg = true;

                loading();
                loadingFlg = true;

                textList = ["〜ガイダンスの終盤〜"];
                nextTextShow();

                loading().then(() => {
                    setTimeout(() => {
                        document.getElementById("loading").style.display = "none";
                    }, 1500);
                    loadingFlg = false;
                });
            }
            
        } else if (nextTextNum == 20) {

            if (rootList.kitamuraRootFlg) {
                unDirectOptionFlg();

                characterImage.src = "../img/character/Kitamura/Kitamura_50%.png";
                nextTagBox.style.display = "block";
                nameTag.textContent = characterName;

                textList = ["うっす、おはようございます！"];
                nextTextShow();
            } else if (rootList.hashidumeRootFlg) {
                unDirectOptionFlg();

                nameTag.textContent = playerName;
                nameTagFlg = true;

                textList = ["！！"];
                nextTextShow();
            } else if (rootList.komatsuRootFlg) {
                unDirectOptionFlg();

                nameTagFlg = true;
                textList = ["（出会って3ヶ月、最近気づいたらコマツさんのことばかり見てしまう、私どうしちゃったんだろう///）"];

                nextTextShow();
            } else if (rootList.hukayaRootFlg) {
                unDirectOptionFlg();

                nameTag.textContent = playerName;
                nameTagFlg = true;

                textList = ["ありがとうございました！"];
                nextTextShow();
            } else if (rootList.katuraRootFlg) {
                unDirectOptionFlg();

                nextTagBox.style.display = "block";
                nameTag.textContent = playerName;
                nameTagFlg = true;

                textList = ["(凄いなぁ…カツラさんメンバーに寄り添いながらも、しっかりするところはしっかりしてる…)"];
                nextTextShow();
            }

        } else if (nextTextNum == 21) {

            if (rootList.kitamuraRootFlg) {
                unDirectOptionFlg();

                nameTag.textContent = playerName;

                textList = ["おはようございます！"];
                nameTagFlg = true;
                nextTextShow();
            } else if (rootList.hashidumeRootFlg) {
                unDirectOptionFlg();

                nameTagFlg = true;
                textList = ["はいっ”！（声が裏返る）"];
                nextTextShow();
            } else if (rootList.komatsuRootFlg) {
                unDirectOptionFlg();

                nameTag.textContent = characterName;
                optionFlg = true;

                let optionText = "…何かありました？";
                let option1 = "はっ！すみません何でもありません！";
                let option2 = "最近気づいたらコマツさんのことを見てしまっているんです//";
                let option1_text = "(どうしたんだろう…？)";
                let option2_text = "突然何言ってるの、シャキッとしてほら（照///）";

                deliveryTextList = [option1_text, option2_text];
                optionDisplay(optionText, option1, option2);
            } else if (rootList.hukayaRootFlg) {
                unDirectOptionFlg();

                nameTagFlg = true;
                textList = ["あの、もしよろしければ今度一緒にお出かけしませんか？"];

                nextTextShow();
            } else if (rootList.katuraRootFlg) {
                unDirectOptionFlg();

                nameTagFlg = true;
                textList = [`(${firstPerson}も見習わなくちゃ！)`];

                nextTextShow();
            }

        } else if (nextTextNum == 22) {

            if (rootList.kitamuraRootFlg) {
                unDirectOptionFlg();

                textList = ["（バンタンに来て3ヶ月…）"];
                nameTagFlg = true;
                nextTextShow();
            } else if (rootList.hashidumeRootFlg) {
                unDirectOptionFlg();

                characterImage.src = "../img/character/Hashidume/Hashidume_1.png";
                nameTag.textContent = characterName;

                textList = ["まぁだ緊張してるの？笑"];
                nextTextShow();
            } else if (rootList.hukayaRootFlg) {
                unDirectOptionFlg();

                nameTag.textContent = characterName;
                textList = ["良いですね。どこに行きますか？"];

                nextTextShow();
            } else if (rootList.katuraRootFlg) {
                unDirectOptionFlg();

                characterImage.src = "../img/character/Katura/Katura_1.png";
                nameTag.textContent = characterName;
                textList = [`${playerName}さん、メンバーの皆にアドバイス的なことってあります？`];

                nextTextShow();
            }

        } else if (nextTextNum == 23) {

            if (rootList.kitamuraRootFlg) {
                unDirectOptionFlg();

                textList = ["（気付いたらキタムラさんのことばかり見てしまう…）"];
                nameTagFlg = true;
                nextTextShow();
            } else if (rootList.hashidumeRootFlg) {
                unDirectOptionFlg();

                nameTag.textContent = playerName;
                nameTagFlg = true;

                textList = ["（恥ずかしい…//）"];
                nextTextShow();
            } else if (rootList.komatsuRootFlg) {
                unDirectOptionFlg();

                nameTag.textContent = playerName;
                nameTagFlg = true;
                option1Flg = false;
                option2Flg = false;

                textList = [`そういえば${firstPerson}、クリスマスマーケット行ってみたいんですよね！`];
                nextTextShow();
            } else if (rootList.hukayaRootFlg) {
                unDirectOptionFlg();

                nameTag.textContent = playerName;
                nameTagFlg = true;

                textList = ["この前友達に紹介された海鮮のお店があるんですが、よければ行きませんか？"];
                nextTextShow();
            } else if (rootList.katuraRootFlg) {
                unDirectOptionFlg();

                nameTag.textContent = playerName;
                nameTagFlg = true;

                textList = [`あ、${firstPerson}ですか？`];
                nextTextShow();
            }

        } else if (nextTextNum == 24) {

            if (rootList.kitamuraRootFlg) {
                unDirectOptionFlg();

                textList = ["（私、どうしちゃったんだろう…//）"]
                nameTagFlg = true;
                nextTextShow();
            } else if (rootList.hashidumeRootFlg) {
                unDirectOptionFlg();

                textList = ["これからよろしくお願いします…//"];
                nextTextShow();
            } else if (rootList.komatsuRootFlg) {
                unDirectOptionFlg();

                nameTag.textContent = characterName;
                optionFlg = true;

                let optionText = "へ〜そんなのやってるんだ";
                let option1 = "今日学校終わった後って何か予定ありますか？";
                let option2 = "今日この後なんかある？";
                let option1_text = "特にないですよ";
                let option2_text = "特にないですよ";

                deliveryTextList = [option1_text, option2_text];
                optionDisplay(optionText, option1, option2);
            } else if (rootList.hukayaRootFlg) {
                unDirectOptionFlg();

                nameTag.textContent = characterName;
                textList = ["ぜひ行きましょう！"];

                nextTextShow();
            } else if (rootList.katuraRootFlg) {
                unDirectOptionFlg();

                nameTagFlg = true;
                textList = ["それじゃあ…"];

                nextTextShow();
            }

        } else if (nextTextNum == 25) {

            if (rootList.kitamuraRootFlg) {
                unDirectOptionFlg();

                let optionText = "どうしたんすか？何か考え事でも？";
                let option1 = "はっ！すみません何でもありません！！";
                let option2 = "最近気づいたらキタムラさんのことを見てしまっているんです//";
                let option1_text = "（どうしたんだろう…？）";
                let option2_text = "どうしたんすか突然！恥ずかしいじゃないっすか//";

                deliveryTextList = [option1_text, option2_text];

                nameTag.textContent = characterName;
                optionFlg = true;

                optionDisplay(optionText, option1, option2);
            } else if (rootList.hashidumeRootFlg) {
                unDirectOptionFlg();

                nameTag.textContent = characterName;
                loadingFlg = true;

                textList = ["おはようございまーす！"];
                nextTextShow();
                loading();
                logRemove();

                loading().then(() => {
                    setTimeout(() => {
                        document.getElementById("loading").style.display = "none";
                    }, 1500);
                    characterImage.src = "../img/character/Hashidume/Hashidume_2.png";
                    characterImage.style.padding = "100px 0 0 0";
                    loadingFlg = false;
                });
            } else if (rootList.hukayaRootFlg) {
                unDirectOptionFlg();
                
                characterImage.src = "#";
                nextTagBox.style.display = "none";
                narrationFlg = true;

                loading();
                loadingFlg = true;

                textList = ["〜店内にて〜"];
                nextTextShow();

                loading().then(() => {
                    setTimeout(() => {
                        document.getElementById("loading").style.display = "none";
                    }, 1500);
                    loadingFlg = false;
                });
            } else if (rootList.katuraRootFlg) {
                unDirectOptionFlg();

                characterImage.src = "#";
                nameTagFlg = true;
                textList = [`メンバーの皆さん！初めまして、ここの新任スタッフになった${playerName}です！`];

                nextTextShow();
            }

        } else if (nextTextNum == 26) {

            if (rootList.hashidumeRootFlg) {
                unDirectOptionFlg();

                nameTag.textContent = playerName;
                nameTagFlg = true;

                textList = ["お、おはようございます！！"];
                nextTextShow();
            } else if (rootList.komatsuRootFlg) {
                unDirectOptionFlg();

                nameTag.textContent = playerName;
                nameTagFlg = true;
                option1Flg = false;
                option2Flg = false;

                textList = ["本当ですか！良かったらどこか一緒に行きませんか？"];
                nextTextShow();
            } else if (rootList.hukayaRootFlg) {
                unDirectOptionFlg();

                nextTagBox.style.display = "block";
                nameTag.textContent = playerName;
                nameTagFlg = true;

                textList = ["深谷さんは何食べますか？"];
                nextTextShow();
            } else if (rootList.katuraRootFlg) {
                unDirectOptionFlg();

                nameTagFlg = true;
                textList = ["あなた達はいずれ、選択を問われる時が来ると思います"];

                nextTextShow();
            }

        } else if (nextTextNum == 27) {

            if (rootList.kitamuraRootFlg) {
                let optionText = "テキスト";
                let option1 = "今日学校終わった後って何か予定ありますか？";
                let option2 = "今日この後なんかある？";
                let option1_text = "特にないっすよ";
                let option2_text = "特にないっすよ";

                deliveryTextList = [option1_text, option2_text];

                optionFlg = true;
                directOptionFlg = true;
                option1Flg = false;
                option2Flg = false;

                optionDisplay(optionText, option1, option2);
            } else if (rootList.hashidumeRootFlg) {
                unDirectOptionFlg();

                textList = ["（や、やばい…！）"];
                nameTagFlg = true;

                nextTextShow();
            } else if (rootList.komatsuRootFlg) {
                unDirectOptionFlg();

                nameTag.textContent = characterName;
                textList = ["まぁ…良いですけど"];

                nextTextShow();
            } else if (rootList.hukayaRootFlg) {
                unDirectOptionFlg();

                characterImage.src = "../img/character/Hukaya/Hukaya_1.png";
                nameTag.textContent = characterName;
                optionFlg = true;

                let optionText = `マグロ丼にしようかな。${playerName}さんはどうしますか？`;
                let option1 = "ネギトロ丼にします";
                let option2 = "タコの踊り食いで";
                let option1_text = "ネギトロ丼も良いな〜シェアしましょうよ！";
                let option2_text = "踊り食い…ですか";

                deliveryTextList = [option1_text, option2_text];
                optionDisplay(optionText, option1, option2);
            } else if (rootList.katuraRootFlg) {
                unDirectOptionFlg();

                nameTagFlg = true;
                textList = [`その選択で後悔しそうなことを選ぶなら、大きい事を選択して挑戦した方が良いと${firstPerson}は思います`];

                nextTextShow();
            }
            
        } else if (nextTextNum == 28) {

            if (rootList.hashidumeRootFlg) {
                unDirectOptionFlg();

                nameTag.textContent = characterName;
                textList = [`${playerName}さん、どうしたんですか？`];

                nextTextShow();
            } else if (rootList.komatsuRootFlg) {
                unDirectOptionFlg();

                optionFlg = true;
                loadingFlg = true;

                loading();
                logRemove();

                loading().then(() => {
                    setTimeout(() => {
                        document.getElementById("loading").style.display = "none";
                    }, 1500);
                    loadingFlg = false;

                    let optionText = "で、どこ行くんですか？";
                    let option1 = "それなら…クリスマスマーケットに行きませんか？";
                    let option2 = "じゃあ…ジャスコに行きませんか？";
                    let option1_text = "あぁ朝言ってたやつですか、良いですよ";
                    let option2_text = "ジャスコ伊丹店いきますか";

                    deliveryTextList = [option1_text, option2_text];
                    optionDisplay(optionText, option1, option2);
                });
            } else if (rootList.katuraRootFlg) {
                unDirectOptionFlg();

                nameTagFlg = true;
                textList = ["例えそれで〜〜……"];

                nextTextShow();
            }

        } else if (nextTextNum == 29) {

            if (rootList.kitamuraRootFlg) {
                unDirectOptionFlg();

                nameTag.textContent = playerName;
                textList = ["本当ですか！良かったらどこか一緒に行きませんか？"];
                nameTagFlg = true;
                option1Flg = false;
                option2Flg = false;

                nextTextShow();
            } else if (rootList.hashidumeRootFlg) {
                unDirectOptionFlg();

                nameTag.textContent = playerName;
                nameTagFlg = true;

                textList = ["ひゃぁぇ！！"];
                nextTextShow();
            } else if (rootList.hukayaRootFlg) {
                unDirectOptionFlg();

                characterImage.src = "#";
                nextTagBox.style.display = "none";

                textList = ["〜食事の後〜"];
                narrationFlg = true;
                loadingFlg = true;
                option1Flg = false;
                option2Flg = false;

                loading();
                nextTextShow();

                loading().then(() => {
                    setTimeout(() => {
                        document.getElementById("loading").style.display = "none";
                    }, 1500);
                    loadingFlg = false;
                });
            } else if (rootList.katuraRootFlg) {
                unDirectOptionFlg();

                characterImage.src = "#";
                nextTagBox.style.display = "none";
                narrationFlg = true;

                loading();
                loadingFlg = true;

                textList = ["〜話が終わり〜"];
                nextTextShow();

                loading().then(() => {
                    setTimeout(() => {
                        document.getElementById("loading").style.display = "none";
                    }, 1500);
                    loadingFlg = false;
                });
            }

        } else if (nextTextNum == 30) {

            if (rootList.kitamuraRootFlg) {
                unDirectOptionFlg();

                nameTag.textContent = characterName;
                textList = ["全然いいっすよ！行きましょうか！"];
                nextTextShow(); 
            } else if (rootList.hashidumeRootFlg) {
                unDirectOptionFlg();

                nameTag.textContent = characterName;
                textList = ["！？"];

                nextTextShow();
            } else if (rootList.komatsuRootFlg) {
                unDirectOptionFlg();

                characterImage.src = "#";
                loadingFlg = true;

                nameTag.textContent = playerName;
                nameTagFlg = true;
                option1Flg = false;
                option2Flg = false;

                textList = ["やっぱクリスマスだから色々イルミネーションとか装飾されてて綺麗でしたね！"];
                nextTextShow();

                loading();
                loading().then(() => {
                    setTimeout(() => {
                        document.getElementById("loading").style.display = "none";
                    }, 1500);
                    loadingFlg = false;
                });
            } else if (rootList.hukayaRootFlg) {
                unDirectOptionFlg();

                nextTagBox.style.display = "block";
                nameTag.textContent = playerName;
                nameTagFlg = true;
                
                textList = ["ご飯どうでしたか？"];
                nextTextShow();
            } else if (rootList.katuraRootFlg) {
                unDirectOptionFlg();

                nextTagBox.style.display = "block";
                nameTag.textContent = playerName;
                nameTagFlg = true;

                textList = ["ご清聴ありがとうございました"];
                nextTextShow();
            }

        } else if (nextTextNum == 31) {

            if (rootList.kitamuraRootFlg) {
                unDirectOptionFlg();

                let optionText = "それじゃ早速っすけど、どこ行きます？";
                let option1 = "実は気になってるレストランがあって、そことかどうですか？";
                let option2 = "近くに二郎系ラーメンのお店があるんですけど、どうですか？";
                let option1_text = "レストランですか！いいっすね！";
                let option2_text = "二郎かあ〜（にんにくキツそうだな…大丈夫かな）";

                deliveryTextList = [option1_text, option2_text];

                nameTag.textContent = characterName;
                optionFlg = true;
                loadingFlg = true;

                optionDisplay(optionText, option1, option2);
            } else if (rootList.hashidumeRootFlg) {
                unDirectOptionFlg();

                textList = ["驚かしちゃいましたか！？ごめんなさい！"];
                nextTextShow();
            } else if (rootList.komatsuRootFlg) {
                unDirectOptionFlg();

                characterImage.src = "../img/character/Komatsu/Komatsu_1.png";
                nameTag.textContent = characterName;
                textList = ["ですね、でもあなたの方がPython3のコードのように綺麗だよ"];

                nextTextShow();
            } else if (rootList.hukayaRootFlg) {
                unDirectOptionFlg();

                characterImage.src = "../img/character/Hukaya/Hukaya_1.png";
                nameTag.textContent = characterName;
                textList = ["とても美味しかったですよ"];

                nextTextShow();
            } else if (rootList.katuraRootFlg) {
                unDirectOptionFlg();

                characterImage.src = "../img/character/Katura/Katura_1.png";
                nameTag.textContent = characterName;

                textList = ["ありがとうございました。とてもいい事を言ってくださいましたね"];
                nextTextShow();
            }

        } else if (nextTextNum == 32) {

            if (rootList.hashidumeRootFlg) {
                unDirectOptionFlg();
                
                nameTag.textContent = playerName;
                nameTagFlg = true;

                textList = ["い、いいい、いえっ！"];
                nextTextShow();
            } else if (rootList.komatsuRootFlg) {
                unDirectOptionFlg();

                nameTag.textContent = playerName;
                nameTagFlg = true;

                textList = ["えっ///"];
                nextTextShow();
            } else if (rootList.hukayaRootFlg) {
                unDirectOptionFlg();

                nameTag.textContent = playerName;
                nameTagFlg = true;

                textList = ["深谷さんのお口に合ってよかったです。また誘っても良いですか？"];
                nextTextShow();
            } else if (rootList.katuraRootFlg) {
                unDirectOptionFlg();

                textList = ["チャレンジをする事ってやっぱり重要なんですね"];
                nextTextShow();
            }

        } else if (nextTextNum == 33) {

            if (rootList.kitamuraRootFlg) {
                unDirectOptionFlg();

                characterImage.src = "#";
                nextTagBox.style.display = "none";
                narrationFlg = true;
                option1Flg = false;
                option2Flg = false;

                loading();
                logRemove();

                loadingFlg = true;
                textList = ["〜食事の後〜"];
                nextTextShow();

                loading().then(() => {
                    setTimeout(() => {
                        document.getElementById("loading").style.display = "none";
                    }, 1500);
                    loadingFlg = false;
                });
            } else if (rootList.hashidumeRootFlg) {
                unDirectOptionFlg();

                textList = [`あ、あの、${firstPerson}実は、ハシヅメさんのこと見るとドキドキしちゃうんです…！`];
                nameTagFlg = true;

                nextTextShow();
            } else if (rootList.komatsuRootFlg) {
                unDirectOptionFlg();

                nameTagFlg = true;
                textList = ["つっ、次はあそこにある大きなクリスマスツリーのところ行きませんか？"];

                nextTextShow();
            } else if (rootList.hukayaRootFlg) {
                unDirectOptionFlg();

                nameTag.textContent = characterName;
                textList = ["良いですよ。また行きましょう！"];

                nextTextShow();
            } else if (rootList.katuraRootFlg) {
                unDirectOptionFlg();

                nextTagBox.style.display = "none";
                narrationFlg = true;

                textList = ["ｷ-ﾝｺ-ﾝｶ-ﾝｺ-ﾝ"];
                nextTextShow();
            }

        } else if (nextTextNum == 34) {

            if (rootList.kitamuraRootFlg) {
                unDirectOptionFlg();

                nameTag.textContent = playerName;
                nextTagBox.style.display = "block";
                nameTagFlg = true;

                textList = ["ご飯美味しかったですか？"];
                nextTextShow();
            } else if (rootList.hashidumeRootFlg) {
                unDirectOptionFlg();

                textList = [`${firstPerson}、ハシヅメさんのこと好きなのかもしれません…！`];
                nameTagFlg = true;

                nextTextShow();
            } else if (rootList.komatsuRootFlg) {
                unDirectOptionFlg();

                nameTag.textContent = characterName;
                textList = ["あぁ良いですよ"];

                nextTextShow();
            } else if (rootList.hukayaRootFlg) {
                unDirectOptionFlg();

                characterImage.src = "#";
                nextTagBox.style.display = "none";

                textList = ["〜授業前〜"];
                narrationFlg = true;
                loadingFlg = true;

                logRemove();
                loading();
                nextTextShow();

                loading().then(() => {
                    setTimeout(() => {
                        document.getElementById("loading").style.display = "none";
                    }, 1500);
                    loadingFlg = false;
                });
            } else if (rootList.katuraRootFlg) {
                unDirectOptionFlg();

                nextTagBox.style.display = "block";
                textList = ["これでガイダンスを終わります。ありがとうございました。"];

                nextTextShow();
            }

        } else if (nextTextNum == 35) {

            if (rootList.kitamuraRootFlg) {
                unDirectOptionFlg();

                characterImage.src = deliveryImage;
                nameTag.textContent = characterName;
                textList = ["はい！美味しかったです！次はどうしますか？"];

                nextTextShow();
            } else if (rootList.hashidumeRootFlg) {
                unDirectOptionFlg();

                nameTag.textContent = characterName;
                textList = ["えぇっ？そ、そうなんですか…？"];

                nextTextShow();
            } else if (rootList.komatsuRootFlg) {
                unDirectOptionFlg();

                characterImage.src = "#";
                loadingFlg = true;

                nameTag.textContent = playerName;
                nameTagFlg = true;
                textList = ["ツリーとってもキラキラしてて綺麗ですね///（今…伝えなきゃ！）"];

                loading();
                nextTextShow();

                loading().then(() => {
                    setTimeout(() => {
                        document.getElementById("loading").style.display = "none";
                    }, 1500);
                    loadingFlg = false;
                });
            } else if (rootList.hukayaRootFlg) {
                unDirectOptionFlg();

                nextTagBox.style.display = "block";
                nameTag.textContent = playerName;
                nameTagFlg = true;

                textList = ["この前はありがとうございました！"];
                nextTextShow();
            } else if (rootList.katuraRootFlg) {
                unDirectOptionFlg();

                characterImage.src = "#";
                nameTag.textContent = "メンバーA";
                namelessFlg = true;

                loading();
                loadingFlg = true;

                textList = [`${playerName}さん！あの考え方素晴らしいと思います！`];
                nextTextShow();

                loading().then(() => {
                    setTimeout(() => {
                        document.getElementById("loading").style.display = "none";
                    }, 1500);
                    loadingFlg = false;
                });
            }

        } else if (nextTextNum == 36) {

            if (rootList.kitamuraRootFlg) {
                unDirectOptionFlg();

                nameTag.textContent = playerName;
                nameTagFlg = true;

                textList = ["次は景色のいい展望台にでも行きませんか？"];
                nextTextShow();
            } else if (rootList.hashidumeRootFlg) {
                unDirectOptionFlg();

                nameTag.textContent = playerName;
                nameTagFlg = true;
                optionFlg = true;

                let optionText = "は、はい…";
                let option1 = "良ければデートに行きませんか！";
                let option2 = "……///（恥ずかしくて何も言えない…）";
                let option1_text = "良いですよ！";
                let option2_text = "ん？どうしたんですか？……もしかしてデートへのお誘いですか？"

                deliveryTextList = [option1_text, option2_text];
                optionDisplay(optionText, option1, option2);
            } else if (rootList.komatsuRootFlg) {
                unDirectOptionFlg();

                characterImage.src = "../img/character/Komatsu/Komatsu_1.png";
                nameTag.textContent = characterName;
                textList = ["綺麗ですね〜"];

                nextTextShow();
            } else if (rootList.hukayaRootFlg) {
                unDirectOptionFlg();

                characterImage.src = "../img/character/Hukaya/Hukaya_1.png";
                nameTag.textContent = characterName;

                textList = ["こちらこそ、ありがとうございました"];
                nextTextShow();
            } else if (rootList.katuraRootFlg) {
                unDirectOptionFlg();

                nameTag.textContent = playerName;
                nameTagFlg = true;

                textList = ["いえいえ、そんなそんな"];
                nextTextShow();
            }

        } else if (nextTextNum == 37) {
            
            if (rootList.kitamuraRootFlg) {
                unDirectOptionFlg();

                nameTag.textContent = characterName;
                textList = ["展望台良いっすね！行きましょう！"];
                nextTextShow();
            } else if (rootList.komatsuRootFlg) {
                unDirectOptionFlg();

                nameTag.textContent = playerName;
                nameTagFlg = true;

                textList = ["あの…実は今日、伝えたいことがあるんです！"];
                nextTextShow();
            } else if (rootList.hukayaRootFlg) {
                unDirectOptionFlg();

                nameTag.textContent = playerName;
                nameTagFlg = true;

                textList = ["今夜って、空いてたりしますか？"];
                nextTextShow();
            } else if (rootList.katuraRootFlg) {
                unDirectOptionFlg();

                characterImage.src = "../img/character/Katura/Katura_1.png";
                nameTag.textContent = characterName;

                textList = ["でも結構いい事だと思いますよ"];
                nextTextShow();
            }

        } else if (nextTextNum == 38) {

            if (rootList.kitamuraRootFlg) {
                unDirectOptionFlg();
                loading();

                characterImage.src = "#";
                nameTag.textContent = playerName;
                nextTagBox.style.display = "none";
                nameTagFlg = true;

                textList = ["いい眺めですね…//（今…伝えなきゃ！）"];
                loadingFlg = true;
                nextTextShow();

                loading().then(() => {
                    setTimeout(() => {
                        document.getElementById("loading").style.display = "none";
                    }, 1500);
                    loadingFlg = false;
                    nextTagBox.style.display = "block";
                });
            } else if (rootList.hashidumeRootFlg) {
                unDirectOptionFlg();

                if (option1Flg) {
                    nameTag.textContent = playerName;
                    nameTagFlg = true;

                    textList = ["！！！"];
                    nextTextShow();
                } else if (option2Flg) {
                    nameTag.textContent = playerName;
                    textList = ["は、はい///"];
                    nameTagFlg = true;

                    nextTextShow();
                }
            } else if (rootList.komatsuRootFlg) {
                unDirectOptionFlg();

                nameTag.textContent = characterName;
                optionFlg = true;

                let optionText = "なんですか？";
                let option1 = "実はコマツさんのことが好きです！付き合ってください！";
                let option2 = "私とパソコンとWi-Fiのような共存関係になってください///";
                let option1_text = "えっ僕ですか？まぁ僕でよければ…";
                let option2_text = "僕も君との恋愛コードを描いていきたい！だからぜひ僕のコードの一部になってくれ！！";

                deliveryTextList = [option1_text, option2_text];
                optionDisplay(optionText, option1, option2);
            } else if (rootList.hukayaRootFlg) {
                unDirectOptionFlg();

                nameTag.textContent = characterName;
                textList = ["空いてますよ"];

                nextTextShow();
            } else if (rootList.katuraRootFlg) {
                unDirectOptionFlg();

                textList = ["後悔しそうなら大きい事ですね、覚えておきます"];
                nextTextShow();
            }

        } else if (nextTextNum == 39) {
            
            if (rootList.kitamuraRootFlg) {
                unDirectOptionFlg();

                nameTag.textContent = characterName;
                textList = ["ホントに綺麗っすね…！"];
                nextTextShow();
            } else if (rootList.hashidumeRootFlg) {
                unDirectOptionFlg();

                if (option1Flg) {
                    textList = ["やった！"];
                    nameTagFlg = true;
                    option1Flg = false
                } else if (option2Flg) {
                    nameTag.textContent = characterName;
                    textList = ["もちろん大丈夫ですよ！"];
                    option2Flg = false;
                }

                nextTextShow();
            } else if (rootList.hukayaRootFlg) {
                unDirectOptionFlg();

                nameTag.textContent = playerName;
                nameTagFlg = true;

                textList = ["よければ、ご飯行きませんか？"];
                nextTextShow();
            } else if (rootList.katuraRootFlg) {
                unDirectOptionFlg();

                nameTag.textContent = playerName;
                nameTagFlg = true;

                textList = ["いやっそんな！留意するような事ではありませんよ汗"];
                nextTextShow();
            }

        } else if (nextTextNum == 40) {

            if (rootList.kitamuraRootFlg) {
                unDirectOptionFlg();

                nameTag.textContent = playerName;
                nameTagFlg = true;

                textList = ["あの…実は今日、伝えたいことがあるんです！"];
                nextTextShow();
            } else if (rootList.hashidumeRootFlg) {
                unDirectOptionFlg();

                nameTag.textContent = playerName;
                nameTagFlg = true;
                textList = ["で、では明日おやすみですので、お時間があれば！"];

                nextTextShow();
            } else if (rootList.hukayaRootFlg) {
                unDirectOptionFlg();

                nameTag.textContent = characterName;
                textList = ["良いですね、行きましょうか"];

                nextTextShow();
            } else if (rootList.komatsuRootFlg) {
                endingMove();
            } else if (rootList.katuraRootFlg) {
                unDirectOptionFlg();

                unDirectOptionFlg();

                characterImage.src = "#";
                nameTag.textContent = playerName;
                nameTagFlg = true;

                logRemove();
                loading();
                loadingFlg = true;

                textList = [`(あれから${firstPerson}はVANTANの案内を受け、仕事内容も詳しく教えてもらった)`];
                nextTextShow();

                loading().then(() => {
                    setTimeout(() => {
                        document.getElementById("loading").style.display = "none";
                    }, 1500);
                    loadingFlg = false;
                });
            }

        } else if (nextTextNum == 41) {

            if (rootList.kitamuraRootFlg) {
                unDirectOptionFlg();

                let optionText = "…なんでしょう？";
                let option1 = "実はキタムラさんのことが好きなんです！付き合ってください！";
                let option2 = "キタムラさんのことが好きなんだばって、わど付き合ってけね？";
                let option1_text = "マジすか！僕でよければ喜んで！";
                let option2_text = "Je suis heureux！";

                deliveryTextList = [option1_text, option2_text];
                characterImage.src = deliveryImage;
                nameTag.textContent = characterName;
                optionFlg = true;

                optionDisplay(optionText, option1, option2);
                endFlg = true;
            } else if (rootList.hashidumeRootFlg) {
                unDirectOptionFlg();

                nameTag.textContent = characterName;
                textList = ["おっ、ちょうど明日空いてるんですね！是非行きましょう！"];

                nextTextShow();
            } else if (rootList.hukayaRootFlg) {
                unDirectOptionFlg();

                characterImage.src = "#";
                nextTagBox.style.display = "none";
                narrationFlg = true;

                loading();

                loadingFlg = true;
                textList = ["〜食事中〜"];
                nextTextShow();

                loading().then(() => {
                    setTimeout(() => {
                        document.getElementById("loading").style.display = "none";
                    }, 1500);
                    loadingFlg = false;
                });
            } else if (rootList.katuraRootFlg) {
                unDirectOptionFlg();

                nameTagFlg = true;
                textList = [`(そして数ヶ月経つ頃にはメンバーさんとも仲良くなれ、自ずと${firstPerson}は相談事を受けることが増えてきた)`];

                nextTextShow();
            }

        } else if (nextTextNum == 42) {

            if (rootList.hashidumeRootFlg) {
                unDirectOptionFlg();

                characterImage.src = "#";
                nextTagBox.style.display = "none";
                narrationFlg = true;

                loading();
                logRemove();

                loadingFlg = true;
                textList = ["〜次の日〜"];
                nextTextShow();

                loading().then(() => {
                    setTimeout(() => {
                        document.getElementById("loading").style.display = "none";
                    }, 1500);
                    loadingFlg = false;
                });
            } else if (rootList.hukayaRootFlg) {
                unDirectOptionFlg();

                nextTagBox.style.display = "block";
                nameTagFlg = true;
                nameTag.textContent = playerName;

                textList = ["この後少しお時間ありますか？"];
                nextTextShow();
            } else if (rootList.katuraRootFlg) {
                unDirectOptionFlg();

                nameTag.textContent = "メンバーA";
                namelessFlg = true;

                textList = [`${playerName}さん。実は今進路に悩んでて…`];
                nextTextShow();
            }

        } else if (nextTextNum == 43) {

            if (rootList.hashidumeRootFlg) {
                unDirectOptionFlg();

                characterImage.src = "../img/character/Hashidume/Hashidume_2.png";
                nextTagBox.style.display = "block";
                nameTag.textContent = characterName;

                textList = ["あ！いたいた"];
                nextTextShow();
            } else if (rootList.hukayaRootFlg) {
                unDirectOptionFlg();

                characterImage.src = "../img/character/Hukaya/Hukaya_1.png";
                nameTag.textContent = characterName;
                optionFlg = true;

                let optionText = "ありますよ。どうかしました？";
                let option1 = "ちょっと気晴らしにドライブでも行きませんか？";
                let option2 = "ちょっと気晴らしに散歩でも行きませんか？";
                let option1_text = "良いですよ";
                let option2_text = "良いですよ";

                deliveryTextList = [option1_text, option2_text];
                optionDisplay(optionText, option1, option2);
            } else if (rootList.kitamuraRootFlg) {
                endingMove();
            } else if (rootList.katuraRootFlg) {
                unDirectOptionFlg();

                nameTag.textContent = playerName;
                nameTagFlg = true;

                textList = ["そうか〜、うーん、やりたいことをやればいいと思うよ"];
                nextTextShow();
            }

        } else if (nextTextNum == 44) {

            if (rootList.hashidumeRootFlg) {
                unDirectOptionFlg();

                nameTag.textContent = playerName;
                nameTagFlg = true;

                textList = ["ハシヅメさん！こんにちは〜"];
                nextTextShow();
            } else if (rootList.katuraRootFlg) {
                unDirectOptionFlg();

                nameTag.textContent = "メンバーA";
                namelessFlg = true;

                textList = [`やりたいこと…${playerName}さんみたいになりたいです！`];
                nextTextShow();
            }

        } else if (nextTextNum == 45) {
            
            if (rootList.hashidumeRootFlg) {
                unDirectOptionFlg();

                nameTag.textContent = characterName;
                textList = ["待たせちゃってごめんね"];

                nextTextShow();
            } else if (rootList.hukayaRootFlg) {
                unDirectOptionFlg();

                characterImage.src = "#";
                nextTagBox.style.display = "none";
                narrationFlg = true;

                loading();
                logRemove();

                loadingFlg = true;
                textList = ["〜外に出て〜"];
                nextTextShow();

                loading().then(() => {
                    setTimeout(() => {
                        document.getElementById("loading").style.display = "none";
                    }, 1500);
                    loadingFlg = false;
                });
            } else if (rootList.katuraRootFlg) {
                unDirectOptionFlg();

                nameTag.textContent = playerName;
                nameTagFlg = true;

                textList = ["本当？嬉しいなぁ"];
                nextTextShow();
            }

        } else if (nextTextNum == 46) {

            if (rootList.hashidumeRootFlg) {
                unDirectOptionFlg();

                nameTag.textContent = playerName;
                nameTagFlg = true;

                textList = ["気にしないでください！楽しみすぎて早く来ちゃっただけなので！"];
                nextTextShow();
            } else if (rootList.hukayaRootFlg) {
                unDirectOptionFlg();

                characterImage.src = "../img/character/Hukaya/Hukaya_1.png";
                nextTagBox.style.display = "block";
                nameTag.textContent = characterName;

                if (option1Flg) {
                    textList = ["たまにはドライブも良いですね〜"];
                    option1Flg = false;
                } else if (option2Flg) {
                    textList = ["たまには散歩も良いですね〜"];
                    option2Flg = false;
                }
                nextTextShow();
            } else if (rootList.katuraRootFlg) {
                unDirectOptionFlg();

                nameTag.textContent = "メンバーA";
                namelessFlg = true;

                textList = ["そんな、本当の事を言っただけですよ！"];
                nextTextShow();
            }

        } else if (nextTextNum == 47) {

            if (rootList.hashidumeRootFlg) {
                unDirectOptionFlg();

                nameTag.textContent = playerName;
                nameTagFlg = true;

                textList = ["そんなに？笑"];
                nextTextShow();
            } else if (rootList.hukayaRootFlg) {
                unDirectOptionFlg();

                nameTag.textContent = playerName;
                nameTagFlg = true;

                textList = ["そうですね！"];
                nextTextShow();
            } else if (rootList.katuraRootFlg) {
                unDirectOptionFlg();

                characterImage.src = "#";
                nextTagBox.style.display = "none";
                narrationFlg = true;
                loadingFlg = true;

                textList = ["〜4階〜"];
                nextTextShow();
                loading();

                loading().then(() => {
                    setTimeout(() => {
                        document.getElementById("loading").style.display = "none";
                    }, 1500);
                    loadingFlg = false;
                });
            }
            
        } else if (nextTextNum == 48) {

            if (rootList.hashidumeRootFlg) {
                unDirectOptionFlg();

                nameTag.textContent = playerName;
                nameTagFlg = true;

                textList = ["は、はい///"];
                nextTextShow();
            } else if (rootList.hukayaRootFlg) {
                unDirectOptionFlg();

                nameTagFlg = true;
                textList = ["（言うなら今しか無い…！）"];

                nextTextShow();
            } else if (rootList.katuraRootFlg) {
                unDirectOptionFlg();

                nextTagBox.style.display = "block";
                nameTag.textContent = playerName;
                nameTagFlg = true;

                textList = ["あ、カツラさんこんにちは"];
                nextTextShow();
            }

        } else if (nextTextNum == 49) {

            if (rootList.hashidumeRootFlg) {
                unDirectOptionFlg();

                nameTag.textContent = characterName;
                textList = ["嬉しいな笑"];

                nextTextShow();
            } else if (rootList.hukayaRootFlg) {
                unDirectOptionFlg();

                nameTagFlg = true;
                textList = ["あの…！"];

                nextTextShow();
            } else if (rootList.katuraRootFlg) {
                unDirectOptionFlg();

                characterImage.src = "../img/character/Katura/Katura_1.png";
                nameTag.textContent = characterName;
                textList = [`${playerName}さんこんにちは〜`];

                nextTextShow();
            }

        } else if (nextTextNum == 50) {

            if (rootList.hashidumeRootFlg) {
                unDirectOptionFlg();

                nameTag.textContent = playerName;
                nameTagFlg = true;

                textList = ["じゃ、じゃあ…どこに行きますか？"];
                nextTextShow();
            } else if (rootList.hukayaRootFlg) {
                unDirectOptionFlg();

                nameTag.textContent = characterName;
                optionFlg = true;

                let optionText = "どうしました？";
                let option1 = "これからずっと一緒にご飯を食べる権利を私にくれませんか？";
                let option2 = "実は深谷さんのことが好きなんです！私と付き合ってください！";
                let option1_text = "私もあなたとの食事が一番美味しく感じるんです。ぜひ！";
                let option2_text = "ありがとうございます。私でよければ！";

                deliveryTextList = [option1_text, option2_text];
                optionDisplay(optionText, option1, option2);
            } else if (rootList.katuraRootFlg) {
                unDirectOptionFlg();

                textList = ["メンバーのメンタルケアまでしてもらって…本当ありがとうございます"];
                nextTextShow();
            }
            
        } else if (nextTextNum == 51) {

            if (rootList.hashidumeRootFlg) {
                
                nameTag.textContent = characterName;
                textList = ["僕、見たい映画があるんですよね〜"];

                nextTextShow();
            } else if (rootList.katuraRootFlg) {
                unDirectOptionFlg();

                nameTag.textContent = playerName;
                nameTagFlg = true;

                textList = ["いえいえ、楽しくやらせてもらっているので！"];
                nextTextShow();
            }

        } else if (nextTextNum == 52) {

            if (rootList.hashidumeRootFlg) {
                unDirectOptionFlg();

                nameTag.textContent = playerName;
                nameTagFlg = true;

                textList = ["映画ですか！行きましょう！"];
                nextTextShow();
            } else if (rootList.hukayaRootFlg) {
                unDirectOptionFlg();

                option1Flg = false;
                option2Flg = false;

                textList = ["一緒に美味しいものを沢山食べに行きましょう！"];
                nextTextShow();
            } else if (rootList.katuraRootFlg) {
                unDirectOptionFlg();

                nameTag.textContent = characterName;
                textList = ["ところで近いうちに親睦も兼ねてご飯でも行きませんか？"];

                nextTextShow();
            }

        } else if (nextTextNum == 53) {

            if (rootList.hashidumeRootFlg) {
                unDirectOptionFlg();

                characterImage.src = "#";
                nextTagBox.style.display = "none";
                narrationFlg = true;
                loadingFlg = true;

                textList = ["〜映画館にて〜"];
                nextTextShow();
                loading();

                loading().then(() => {
                    setTimeout(() => {
                        document.getElementById("loading").style.display = "none";
                    }, 1500);
                    loadingFlg = false;
                });
            } else if (rootList.hukayaRootFlg) {
                endingMove();
            } else if (rootList.katuraRootFlg) {
                unDirectOptionFlg();

                nameTag.textContent = playerName;
                nameTagFlg = true;

                textList = ["いいですね！私ココとココと〜……が空いてますね"];
                nextTextShow();
            }

        } else if (nextTextNum == 54) {

            if (rootList.hashidumeRootFlg) {
                unDirectOptionFlg();

                nextTagBox.style.display = "block";
                nameTag.textContent = playerName;
                nameTagFlg = true;

                textList = ["ハシヅメさん！ポップコーンどうしますか？"];
                nextTextShow();
            } else if (rootList.katuraRootFlg) {
                unDirectOptionFlg();

                nameTag.textContent = characterName;
                textList = ["じゃあ、ここのタイミングで"];

                nextTextShow();
            }

        } else if (nextTextNum == 55) {

            if (rootList.hashidumeRootFlg) {
                unDirectOptionFlg();

                characterImage.src = "../img/character/Hashidume/Hashidume_1.png";
                characterImage.style.padding = "0";
                nameTag.textContent = characterName;
                optionFlg = true;

                let optionText = `買っちゃおうか！${playerName}さんが選んでいいよ`;
                let option1 = "ガーリックチーズにしましょう！";
                let option2 = "キャラメルにしましょう！";
                let option1_text = "ガ、ガーリックチーズ…";
                let option2_text = "キャラメル良いね！そうしよう！";

                deliveryTextList = [option1_text, option2_text];
                optionDisplay(optionText, option1, option2);
            } else if (rootList.katuraRootFlg) {
                unDirectOptionFlg();

                nameTag.textContent = playerName;
                nameTagFlg = true;

                textList = ["了解です！"];
                nextTextShow();
            }

        } else if (nextTextNum == 56) {

            if (rootList.katuraRootFlg) {
                unDirectOptionFlg();

                characterImage.src = "#";
                nextTagBox.style.display = "none";
                narrationFlg = true;
                loadingFlg = true;

                textList = ["〜日が暮れる頃〜"];
                nextTextShow();
                loading();

                loading().then(() => {
                    setTimeout(() => {
                        document.getElementById("loading").style.display = "none";
                    }, 1500);
                    loadingFlg = false;
                });
            }

        } else if (nextTextNum == 57) {

            if (rootList.hashidumeRootFlg) {
                unDirectOptionFlg();

                nameTag.textContent = characterName;
                textList = ["じゃ、見に行こっか"];
                option1Flg = false;
                option2Flg = false;

                nextTextShow();
            } else if (rootList.katuraRootFlg) {
                unDirectOptionFlg();

                nextTagBox.style.display = "block";
                nameTag.textContent = playerName;
                nameTagFlg = true;

                textList = ["今度食事に行こうってカツラさんから誘われたんですよ！"];
                nextTextShow();
            }

        } else if (nextTextNum == 58) {

            if (rootList.hashidumeRootFlg) {
                unDirectOptionFlg();

                characterImage.src = "#";
                nextTagBox.style.display = "none";
                narrationFlg = true;
                loadingFlg = true;

                textList = ["〜映画が終わり〜"];
                nextTextShow();
                loading();

                loading().then(() => {
                    setTimeout(() => {
                        document.getElementById("loading").style.display = "none";
                    }, 1500);
                    loadingFlg = false;
                });
            } else if (rootList.katuraRootFlg) {
                unDirectOptionFlg();

                characterImage.src = "../img/character/Kajima/Kajima_2.png";
                characterImage.style.padding = "0";

                nextTagBox.style.display = "block";
                nameTag.textContent = "タカヨ";
                namelessFlg = true;

                textList = ["お食事いいですね！"];
                nextTextShow();
            }

        } else if (nextTextNum == 59) {

            if (rootList.hashidumeRootFlg) {
                unDirectOptionFlg();

                characterImage.src = "../img/character/Hashidume/Hashidume_1.png";
                nameTag.textContent = characterName;
                nextTagBox.style.display = "block";

                textList = ["いや〜あそこのシーン良かったよね！"];
                nextTextShow();
            } else if (rootList.katuraRootFlg) {
                unDirectOptionFlg();

                nameTag.textContent = playerName;
                nameTagFlg = true;

                textList = ["そこで相談なんですけど、いつもお世話になってるお礼に何か贈り物でもと思いまして"];
                nextTextShow();
            }

        } else if (nextTextNum == 60) {

            if (rootList.hashidumeRootFlg) {
                unDirectOptionFlg();

                nameTag.textContent = playerName;
                nameTagFlg = true;

                textList = ["あのキャラもすっごく可愛かったです！"];
                nextTextShow();
            } else if (rootList.katuraRootFlg) {
                unDirectOptionFlg();

                characterImage.src = "../img/character/Kajima/Kajima_1.png";
                nameTag.textContent = "カツヨシ";
                namelessFlg = true;

                textList = ["なら腕時計とかどうですか？"];
                nextTextShow();
            }

        } else if (nextTextNum == 61) {

            if (rootList.hashidumeRootFlg) {
                unDirectOptionFlg();

                nameTag.textContent = characterName;
                textList = ["だね〜"];

                nextTextShow();
            } else if (rootList.katuraRootFlg) {
                unDirectOptionFlg();

                characterImage.src = "../img/character/Kajima/Kajima_2.png";
                nameTag.textContent = "タカヨ";
                namelessFlg = true;

                textList = ["そうですね、この前壊れてしまったと言っていましたし"];
                nextTextShow();
            }

        } else if (nextTextNum == 62) {

            if (rootList.hashidumeRootFlg) {
                unDirectOptionFlg();
                optionFlg = true;

                let optionText = "何かグッズでも買っていく？";
                let option1 = "買いに行きましょう！";
                let option2 = "ごめんなさい…お金が無いので買わないでおきます";
                let option1_text = "お揃いのグッズ買おうよ！";
                let option2_text = "そっかぁ…残念";

                deliveryTextList = [option1_text, option2_text];
                optionDisplay(optionText, option1, option2);
            } else if (rootList.katuraRootFlg) {
                unDirectOptionFlg();

                nameTag.textContent = playerName;
                nameTagFlg = true;

                textList = ["そうなんですね、なら腕時計にします！"];
                nextTextShow();
            }

        } else if (nextTextNum == 63) {

            if (rootList.katuraRootFlg) {
                unDirectOptionFlg();

                nameTag.textContent = "タカヨ";
                namelessFlg = true;

                textList = ["頑張ってください！"];
                nextTextShow();
            }
            
        } else if (nextTextNum == 64) {

            if (rootList.hashidumeRootFlg) {
                unDirectOptionFlg();

                loadingFlg = true;
                option1Flg = false;
                option2Flg = false;

                textList = ["いや〜それにしても外暑いね〜"];
                nextTextShow();
                loading();

                loading().then(() => {
                    setTimeout(() => {
                        document.getElementById("loading").style.display = "none";
                    }, 1500);
                    loadingFlg = false;
                });
            } else if (rootList.katuraRootFlg) {
                unDirectOptionFlg();

                characterImage.src = "../img/character/Kajima/Kajima_1.png";
                nameTag.textContent = "カツヨシ";
                namelessFlg = true;

                textList = ["GOOD LUCK！"];
                nextTextShow();
            }

        } else if (nextTextNum == 65) {

            if (rootList.hashidumeRootFlg) {
                unDirectOptionFlg();

                nameTag.textContent = playerName;
                nameTagFlg = true;

                textList = ["そ、そうですね"];
                nextTextShow();
            } else if (rootList.katuraRootFlg) {
                unDirectOptionFlg();

                nameTag.textContent = playerName;
                nameTagFlg = true;

                textList = ["頑張ります！"];
                nextTextShow();
            }
            
        } else if (nextTextNum == 66) {

            if (rootList.hashidumeRootFlg) {
                unDirectOptionFlg();

                nameTag.textContent = characterName;
                textList = ["アイスでも食べる？"];

                nextTextShow();
            } else if (rootList.katuraRootFlg) {
                unDirectOptionFlg();

                characterImage.src = "#";
                nextTagBox.style.display = "none";
                narrationFlg = true;
                loadingFlg = true;

                textList = ["〜食事の日〜"];
                nextTextShow();
                loading();

                loading().then(() => {
                    setTimeout(() => {
                        document.getElementById("loading").style.display = "none";
                    }, 1500);
                    loadingFlg = false;
                });
            }

        } else if (nextTextNum == 67) {

            if (rootList.hashidumeRootFlg) {
                unDirectOptionFlg();

                nameTag.textContent = playerName;
                nameTagFlg = true;
                optionFlg = true;

                let optionText = "食べましょうか！涼みましょう！";
                let option1 = "バニラ一緒に食べませんか？";
                let option2 = "大納言あずき食べませんか？";
                let option1_text = "そうしましょう！";
                let option2_text = "だ、大納言あずき…？";

                deliveryTextList = [option1_text, option2_text];
                optionDisplay(optionText, option1, option2);
            } else if (rootList.katuraRootFlg) {
                unDirectOptionFlg();

                characterImage.src = "../img/character/Katura/Katura_1.png";
                characterImage.style.padding = "50px 0 0 0";

                nextTagBox.style.display = "block";
                nameTag.textContent = characterName;

                textList = [`${playerName}さん。そろそろ行きましょうか`];
                nextTextShow();
            }

        } else if (nextTextNum == 68) {

            if (rootList.katuraRootFlg) {
                unDirectOptionFlg();

                nameTag.textContent = playerName;
                nameTagFlg = true;

                textList = ["そういえばお店ってどこに行くんですか？"];
                nextTextShow();
            }

        } else if (nextTextNum == 69) {

            if (rootList.hashidumeRootFlg) {
                unDirectOptionFlg();

                nameTagFlg = true;
                option1Flg = false;
                option2Flg = false;

                textList = ["ん〜〜〜〜！！冷たくて美味しいです！"];
                nextTextShow();
            } else if (rootList.katuraRootFlg) {
                unDirectOptionFlg();

                nameTag.textContent = characterName;
                textList = ["任せてください。いい所知ってるんで"];

                nextTextShow();
            }

        } else if (nextTextNum == 70) {

            if (rootList.hashidumeRootFlg) {
                unDirectOptionFlg();

                nameTag.textContent = characterName;
                textList = ["結構涼めたね〜"];

                nextTextShow();
            } else if (rootList.katuraRootFlg) {
                unDirectOptionFlg();

                characterImage.src = "#";
                nextTagBox.style.display = "none";
                narrationFlg = true;
                loadingFlg = true;

                textList = ["〜食事の後〜"];
                nextTextShow();
                loading();

                loading().then(() => {
                    setTimeout(() => {
                        document.getElementById("loading").style.display = "none";
                    }, 1500);
                    loadingFlg = false;
                });
            }
            
        } else if (nextTextNum == 71) {

            if (rootList.hashidumeRootFlg) {
                unDirectOptionFlg();

                textList = ["そろそろ良い時間だし、今日はここら辺で解散にしようか"]
                nextTextShow();
            } else if (rootList.katuraRootFlg) {
                unDirectOptionFlg();

                nextTagBox.style.display = "block";
                nameTagFlg = true;
                nameTag.textContent = playerName;

                textList = ["ここの和食すごく美味しかったです！"];
                nextTextShow();
            }

        } else if (nextTextNum == 72) {

            if (rootList.hashidumeRootFlg) {
                unDirectOptionFlg();

                nameTag.textContent = playerName;
                nameTagFlg = true;

                textList = ["そう…ですね…"];
                nextTextShow();
            } else if (rootList.katuraRootFlg) {
                unDirectOptionFlg();

                nameTagFlg = true;
                textList = [`${firstPerson}、和食好きなんですよね〜`];

                nextTextShow();
            }

        } else if (nextTextNum == 73) {

            if (rootList.hashidumeRootFlg) {
                unDirectOptionFlg();

                nameTagFlg = true;
                textList = ["えと、その…"];
                nextTextShow();
            } else if (rootList.katuraRootFlg) {
                unDirectOptionFlg();

                characterImage.src = "../img/character/Katura/Katura_1.png";
                nameTag.textContent = characterName;

                textList = ["どうやら僕の予想は当たっていたようですね！"];
                nextTextShow();
            }

        } else if (nextTextNum == 74) {

            if (rootList.hashidumeRootFlg) {
                unDirectOptionFlg();

                nameTag.textContent = characterName;
                textList = ["どうしたんですか？"];

                nextTextShow();
            } else if (rootList.katuraRootFlg) {
                unDirectOptionFlg();

                nameTag.textContent = playerName;
                nameTagFlg = true;

                textList = [`(すごい…${firstPerson}の好みまで見通されてるようでなんだか嬉しいっ！)`];
                nextTextShow();
            }

        } else if (nextTextNum == 75) {

            if (rootList.hashidumeRootFlg) {
                unDirectOptionFlg();

                nameTag.textContent = playerName;
                optionFlg = true;

                let optionText = "あの！ハシヅメさん…！";
                let option1 = `${firstPerson}と付き合ってください！`;
                let option2 = `${firstPerson}付き合ってくだせぇっ！`;

                optionDisplay(optionText, option1, option2);
            } else if (rootList.katuraRootFlg) {
                unDirectOptionFlg();

                nameTagFlg = true;
                textList = ["実は今日、渡したいものがありまして…！"];

                nextTextShow();
            }

        } else if (nextTextNum == 76) {

            if (rootList.katuraRootFlg) {
                unDirectOptionFlg();

                nameTagFlg = true;
                textList = ["日頃のお礼として受け取っていただけば幸いです"];

                nextTextShow();
            }

        } else if (nextTextNum == 77) {

            if (rootList.hashidumeRootFlg) {
                endingMove();
            } else if (rootList.katuraRootFlg) {
                unDirectOptionFlg();

                nameTag.textContent = characterName;
                textList = ["おお！腕時計じゃないですか！"];

                nextTextShow();
            }

        } else if (nextTextNum == 78) {

            if (rootList.katuraRootFlg) {
                unDirectOptionFlg();

                textList = ["最近壊れてしまって…ありがとうございます！"];
                nextTextShow();
            }

        } else if (nextTextNum == 79) {

            if (rootList.katuraRootFlg) {
                unDirectOptionFlg();

                nameTag.textContent = playerName;
                nameTagFlg = true;
                optionFlg = true;

                let optionText = "いえいえ、いつもお世話になっていますので";
                let option1 = "その…できればなんですが、今後ともご飯とかいかがですか？";
                let option2 = "カツラさんとのご飯楽しかったです！また行きたいです！";
                let option1_text = "是非是非、また行きましょう";
                let option2_text = "楽しんでもらえて何よりです！また行きましょう！";

                deliveryTextList = [option1_text, option2_text];
                optionDisplay(optionText, option1, option2);
            }

        } else if (nextTextNum == 81) {

            if (rootList.katuraRootFlg) {
                unDirectOptionFlg();

                nameTag.textContent = playerName;
                nameTagFlg = true;

                textList = ["(……これまでもカジマさん達やハシヅメさんとご飯に行ったことはあったけど)"];
                nextTextShow();
            }
            
        } else if (nextTextNum == 82) {

            if (rootList.katuraRootFlg) {
                unDirectOptionFlg();

                nameTagFlg = true;
                textList = ["(なんだかカツラさんだとまた別の嬉しさがあるというか…)"];

                nextTextShow();
            }

        } else if (nextTextNum == 83) {

            if (rootList.katuraRootFlg) {
                unDirectOptionFlg();

                nameTagFlg = true;
                textList = ["(もしかして…)"];

                nextTextShow();
            }

        } else if (nextTextNum == 84) {

            if (rootList.katuraRootFlg) {
                unDirectOptionFlg();

                characterImage.src = "#";
                nameTagFlg = true;
                loadingFlg = true;

                textList = ["(あれから何度もカツラさんとお食事に行ったり、時にはお買い物に出かけることもあった)"];
                nextTextShow();
                logRemove();
                loading();

                loading().then(() => {
                    setTimeout(() => {
                        document.getElementById("loading").style.display = "none";
                    }, 1500);
                    loadingFlg = false;
                });
            }

        } else if (nextTextNum == 85) {

            if (rootList.katuraRootFlg) {
                unDirectOptionFlg();

                nameTagFlg = true;
                textList = ["(そしてあの気持ちもカツラさんと会う度に増していった)"];

                nextTextShow();
            }

        } else if (nextTextNum == 86) {

            if (rootList.katuraRootFlg) {
                unDirectOptionFlg();
                
                nameTagFlg = true;
                textList = [`(気付けば${firstPerson}の側からカツラさんがいなくなることが少なくなった)`];

                nextTextShow();
            }

        } else if (nextTextNum == 87) {

            if (rootList.katuraRootFlg) {
                unDirectOptionFlg();

                nameTagFlg = true;
                textList = ["カツラさん、この資料ここに置いておきますね"];

                nextTextShow();
            }

        } else if (nextTextNum == 88) {

            if (rootList.katuraRootFlg) {
                unDirectOptionFlg();

                characterImage.src = "../img/character/Katura/Katura_5.png";
                characterImage.style.padding = "0";

                nameTag.textContent = characterName;
                textList = [`ありがとうね。${playerName}さん`];

                nextTextShow();
            }

        } else if (nextTextNum == 89) {

            if (rootList.katuraRootFlg) {
                unDirectOptionFlg();

                nameTag.textContent = playerName;
                nameTagFlg = true;

                textList = ["(なんだかカツラさんの元気がないように見えるな…)"];
                nextTextShow();
            }

        } else if (nextTextNum == 90) {

            if (rootList.katuraRootFlg) {
                unDirectOptionFlg();

                nameTagFlg = true;
                textList = ["あ、そこってこうでしたっけ？"];

                nextTextShow();
            }

        } else if (nextTextNum == 91) {

            if (rootList.katuraRootFlg) {
                unDirectOptionFlg();

                nameTag.textContent = characterName;
                optionFlg = true;

                let optionText = "ああ…これは…そうだね";
                let option1 = "そういえば、疲れを取れるツボ押しグッズがあるので試してみませんか？";
                let option2 = "何か元気になれる飲み物でも買ってきましょうか？";
                let option1_text = "ありがとう…";
                let option2_text = "ありがとう。それなら甘めの飲み物をお願いします";

                deliveryTextList = [option1_text, option2_text];
                optionDisplay(optionText, option1, option2);
            }

        } else if (nextTextNum == 93) {

            if (rootList.katuraRootFlg) {
                unDirectOptionFlg();

                nameTag.textContent = playerName;
                nameTagFlg = true;

                textList = ["じゃあ行ってきますね"];
                nextTextShow();
            }

        } else if (nextTextNum == 94) {

            if (rootList.katuraRootFlg) {
                unDirectOptionFlg();

                characterImage.src = "#";
                nextTagBox.style.display = "none";
                narrationFlg = true;
                loadingFlg = true;

                textList = ["〜戻ってきて〜"];
                nextTextShow();
                loading();

                loading().then(() => {
                    setTimeout(() => {
                        document.getElementById("loading").style.display = "none";
                    }, 1500);
                    loadingFlg = false;
                });
            }

        } else if (nextTextNum == 95) {

            if (rootList.katuraRootFlg) {
                unDirectOptionFlg();

                characterImage.src = "../img/character/Hashidume/Hashidume_1.png";
                nextTagBox.style.display = "block";
                nameTag.textContent = "ハシヅメ";
                namelessFlg = true;

                textList = ["カツラさんあの話って本当なんですか？"];
                nextTextShow();
            }

        } else if (nextTextNum == 96) {

            if (rootList.katuraRootFlg) {
                unDirectOptionFlg();

                characterImage.src = "../img/character/Katura/Katura_1.png";
                characterImage.style.padding = "50px 0 0 0";
                nameTag.textContent = characterName;

                textList = ["何の話です？まさか一発ギャグをしてくれるっていう！？"];
                nextTextShow();
            }
            
        } else if (nextTextNum == 97) {

            if (rootList.katuraRootFlg) {
                unDirectOptionFlg();

                characterImage.src = "../img/character/Hashidume/Hashidume_1.png";
                nameTag.textContent = "ハシヅメ";
                namelessFlg = true;

                textList = ["聞きましたよ！東京校の方がスタッフ不足だから向こうに異動するって！"];
                nextTextShow();
            }

        } else if (nextTextNum == 98) {

            if (rootList.katuraRootFlg) {
                unDirectOptionFlg();

                nameTag.textContent = playerName;
                nameTagFlg = true;

                textList = ["(え……)"];
                nextTextShow();
            }

        } else if (nextTextNum == 99) {

            if (rootList.katuraRootFlg) {
                unDirectOptionFlg();

                characterImage.src = "../img/character/Katura/Katura_1.png";
                nameTag.textContent = characterName;

                textList = ["そうですか...聞いていたんですね"];
                nextTextShow();
            }

        } else if (nextTextNum == 100) {

            if (rootList.katuraRootFlg) {
                unDirectOptionFlg();

                characterImage.src = "../img/character/Hashidume/Hashidume_1.png";
                nameTag.textContent = "ハシヅメ";
                namelessFlg = true;

                textList = ["はい…少し…"];
                nextTextShow();
            }

        } else if (nextTextNum == 101) {

            if (rootList.katuraRootFlg) {
                unDirectOptionFlg();

                nameTag.textContent = playerName;
                nameTagFlg = true;

                textList = ["(分からない…今どういう状況なのか…)"];
                nextTextShow();
            }

        } else if (nextTextNum == 102) {

            if (rootList.katuraRootFlg) {
                unDirectOptionFlg();

                nameTagFlg = true;
                textList = ["(カツラさんが東京に行くことを拒絶しているようで…理解ができない…)"];

                nextTextShow();
            }

        } else if (nextTextNum == 103) {

            if (rootList.katuraRootFlg) {
                unDirectOptionFlg();

                characterImage.src = "#";
                nameTagFlg = true;
                optionFlg = true;

                let optionText = "(でも…ここであの気持ちと向き合わないと…！)";
                let option1 = "告白する";
                let option2 = "・・・";
                let option1_text = "(言葉が出ない…でも…！)";
                let option2_text = "・・・";

                deliveryTextList = [option1_text, option2_text];
                optionDisplay(optionText, option1, option2);
            }

        } else if (nextTextNum == 105) {

            if (rootList.katuraRootFlg) {
                let optionText = "テキスト";
                let option1 = "告白をしたい！";
                let option2 = "・・・ ";
                let option1_text = "カツラさん！！すっっっ！！…きやきのまね～(激スベり)";
                let option2_text = "(そうだ…今好きだなんて言ったらきっとカツラさんも困るよ…)";

                optionFlg = true;
                directOptionFlg = true;

                deliveryTextList = [option1_text, option2_text];
                optionDisplay(optionText, option1, option2);
            }

        } else if (nextTextNum == 107) {

            if (rootList.katuraRootFlg) {
                unDirectOptionFlg();

                nameTag.textContent = "その場にいる全員";
                namelessFlg = true;

                textList = ["・・・"];
                nextTextShow();
            }

        } else if (nextTextNum == 108) {

            if (rootList.katuraRootFlg) {
                unDirectOptionFlg();

                characterImage.src = "../img/character/Katura/Katura_1.png";
                nameTag.textContent = characterName;
                textList = ["…出世…ってことですかね…"];

                nextTextShow();
            }

        } else if (nextTextNum == 109) {

            if (rootList.katuraRootFlg) {
                unDirectOptionFlg();

                nameTag.textContent = playerName;
                nameTagFlg = true;

                textList = ["(…そうだ、カツラさんの言った通り出世したと捉えることだって出来る)"];
                nextTextShow();
            }

        } else if (nextTextNum == 110) {

            if (rootList.katuraRootFlg) {
                unDirectOptionFlg();

                nameTagFlg = true;
                textList = ["(うん…応援することにしよう！)"];

                nextTextShow();
            }

        } else if (nextTextNum == 111) {

            if (rootList.katuraRootFlg) {
                unDirectOptionFlg();

                characterImage.src = "#";
                nextTagBox.style.display = "none";
                narrationFlg = true;
                loadingFlg = true;

                textList = ["〜その日の帰り〜"];
                nextTextShow();
                loading();

                loading().then(() => {
                    setTimeout(() => {
                        document.getElementById("loading").style.display = "none";
                    }, 1500);
                    loadingFlg = false;
                });
            }

        } else if (nextTextNum == 112) {

            if (rootList.katuraRootFlg) {
                unDirectOptionFlg();

                nextTagBox.style.display = "block";
                nameTag.textContent = playerName;
                nameTagFlg = true;

                textList = ["カツラさん、出世？おめでとうございます！"];
                nextTextShow();
            }

        } else if (nextTextNum == 113) {

            if (rootList.katuraRootFlg) {
                unDirectOptionFlg();

                characterImage.src = "../img/character/Katura/Katura_1.png";
                nameTag.textContent = characterName;
                textList = ["ありがとう。でも正直困っているところはあるんですよね"];

                nextTextShow();
            }

        } else if (nextTextNum == 114) {

            if (rootList.katuraRootFlg) {
                unDirectOptionFlg();

                textList = ["やっぱり名古屋校でこうして仕事をするのも楽しかったので"];
                nextTextShow();
            }

        } else if (nextTextNum == 115) {

            if (rootList.katuraRootFlg) {
                unDirectOptionFlg();

                nameTag.textContent = playerName;
                nameTagFlg = true;

                textList = ["大きいことに挑戦するいいチャンスじゃないんですか？"];
                nextTextShow();
            }

        } else if (nextTextNum == 116) {

            if (rootList.katuraRootFlg) {
                unDirectOptionFlg();

                nameTagFlg = true;
                optionFlg = true;

                let optionText = "それにカツラさんだって挑戦することが大事って言ってたじゃないですか";
                let option1 = "正直に言うと…カツラさんのこと好きですよ。人としても、それ以外の意味でも";
                let option2 = "カツラさんは誰からも尊敬される人だと思ってますよ！";
                let option1_text = "そんな魅力的な方が東京に行ったら失敗するなんて考えられません！";
                let option2_text = "そんな人が東京で失敗なんてある訳ないじゃないですか！";

                deliveryTextList = [option1_text, option2_text];
                optionDisplay(optionText, option1, option2);
            }

        } else if (nextTextNum == 118) {

            if (rootList.katuraRootFlg) {
                unDirectOptionFlg();

                nameTagFlg = true;
                textList = [`まあ…${firstPerson}の言葉は独り言程度に受け取ってもらえればいいので…`];

                nextTextShow();
            }

        } else if (nextTextNum == 119) {

            if (rootList.katuraRootFlg) {
                unDirectOptionFlg();

                nameTag.textContent = characterName;
                textList = ["そうだね…決めたよ"];

                nextTextShow();
            }

        } else if (nextTextNum == 120) {

            if (rootList.katuraRootFlg) {
                unDirectOptionFlg();

                textList = ["僕は……"];
                nextTextShow();
            }

        } else if (nextTextNum == 121) {

            if (rootList.katuraRootFlg) {
                endingMove();
            }

        }
        
        setTimeout(() => {
            nextButton.style.display = "none";
        }, 310);

        async function nextTextShow() {
            if (!optionFlg) {
                if (loadingFlg) {
                    setTimeout(() => {
                        showText(textDivision(textList));
                    }, 1500);
                } else if (!endFlg) {
                    showText(textDivision(textList));
                }
            }
        }

        function unDirectOptionFlg() {
            if (!directOptionFlg) {
                currentText.innerHTML = ""; // 現在のテキストを初期化
            }
        }
        
    }
    console.log("現在のテキスト番号 : " + String(nextTextNum)); // 現在のテキスト番号 (デバッグ用)
}

// エンディング画面へ遷移
function endingMove() {
    const loading = document.getElementById("loading");
    localStorage.setItem("favourableImpression", favourableImpression);

    loadingDisplay().then(() => {
        window.location = "ending.html"; // resolveが返されたらURLを変更してページを遷移
    });

    function loadingDisplay() {
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
        const backgroundImage = document.getElementById("main_box");

        loading.style.display = "block";

        setTimeout(() => {
            loading.style.backgroundColor = "#111";
            loading.style.zIndex = 0;
            loading.style.opacity = 1;
        }, 100);

        setTimeout(() => {
            if (rootList.kitamuraRootFlg) {
                if (nextTextNum == 7) {
                    backgroundImage.style.backgroundImage = "url('../img/background/503_class2.jpg')";
                } else if (nextTextNum == 19) {
                    backgroundImage.style.backgroundImage = "url('../img/background/5F_space3.jpg')";
                } else if (nextTextNum == 33) {
                    backgroundImage.style.backgroundImage = "url('../img/background/4F_space2.jpg')";
                } else if (nextTextNum == 38) {
                    backgroundImage.style.backgroundImage = "url('../img/background/Nagoya_view.jpg')";
                }
            } else if (rootList.hashidumeRootFlg) {
                if (nextTextNum == 9) {
                    backgroundImage.style.backgroundImage = "url('../img/background/402_class3.jpg')";
                } else if (nextTextNum == 25) {
                    backgroundImage.style.backgroundImage = "url('../img/background/4F_space1.jpg')";
                } else if (nextTextNum == 42) {
                    backgroundImage.style.backgroundImage = "url('../img/background/2F_space1.jpg')";
                } else if (nextTextNum == 53) {
                    backgroundImage.style.backgroundImage = "url('../img/background/cinema_shop.png')";
                } else if (nextTextNum == 64) {
                    backgroundImage.style.backgroundImage = "url('../img/background/ice_cream_store.jpg')";
                }
            } else if (rootList.komatsuRootFlg) {
                if (nextTextNum == 5) {
                    backgroundImage.style.backgroundImage = "url('../img/background/402_class2.jpg')";
                } else if (nextTextNum == 17) {
                    backgroundImage.style.backgroundImage = "url('../img/background/5F_space2.jpg')";
                } else if (nextTextNum == 30) {
                    backgroundImage.style.backgroundImage = "url('../img/background/Night_Park.jpg')";
                } else if (nextTextNum == 35) {
                    backgroundImage.style.backgroundImage = "url('../img/background/Christmas tree.webp')";
                }
            } else if (rootList.hukayaRootFlg) {
                if (nextTextNum == 6) {
                    backgroundImage.style.backgroundImage = "url('../img/background/504_class1.jpg')";
                } else if (nextTextNum == 18) {
                    backgroundImage.style.backgroundImage = "url('../img/background/5F_space1.jpg')";
                } else if (nextTextNum == 25) {
                    backgroundImage.style.backgroundImage = "url('../img/background/restaurant.jpg')";
                } else if (nextTextNum == 34) {
                    backgroundImage.style.backgroundImage = "url('../img/background/504_class1.jpg')";
                } else if (nextTextNum == 41) {
                    backgroundImage.style.backgroundImage = "url('../img/background/normal_restaurant.jpg')";
                } else if (nextTextNum == 45) {
                    backgroundImage.style.backgroundImage = "url('../img/background/Night_street.jpg')";
                }
            } else if (rootList.katuraRootFlg) {
                if (nextTextNum == 11) {
                    backgroundImage.style.backgroundImage = "url('../img/background/403_class1.jpg')";
                } else if (nextTextNum == 40) {
                    backgroundImage.style.backgroundImage = "url('../img/background/5F_space3.jpg')";
                } else if (nextTextNum == 47) {
                    backgroundImage.style.backgroundImage = "url('../img/background/4F_space1.jpg')";
                } else if (nextTextNum == 56) {
                    backgroundImage.style.backgroundImage = "url('../img/background/4F_space2.jpg')";
                } else if (nextTextNum == 66) {
                    backgroundImage.style.backgroundImage = "url('../img/background/2F_space1.jpg')";
                } else if (nextTextNum == 70) {
                    backgroundImage.style.backgroundImage = "url('../img/background/restaurant.jpg')";
                } else if (nextTextNum == 84) {
                    backgroundImage.style.backgroundImage = "url('../img/background/5F_space1.jpg')";
                } else if (nextTextNum == 111) {
                    backgroundImage.style.backgroundImage = "url('../img/background/2F_space2.jpg')";
                }
            }

            loading.style.opacity = 0;
            resolve();
        }, 1600);
    });
}

// ログの中身を削除
function logRemove() {
    const logSidebarText = document.getElementById("log_sidebar_text");

    while (logSidebarText.firstChild) {
        logSidebarText.removeChild(logSidebarText.firstChild);
    }
}

// テキストを一文字づつ表示
async function showText(passedTextList) {
    return new Promise(async (resolve) => {
        if (textSkipFlg) {
            resolve();
            return;
        }
        if (currentIndex < passedTextList.length) {
            if (optionSelectedFlg) {
                let currentText = document.getElementById("currentText");
                let textWindow = document.getElementById("text_window");
                let characterImage = document.getElementById("characterImage_box");
                let optionBox1 = document.getElementById("optionBox1");
                let optionBox2 = document.getElementById("optionBox2");
    
                async function textWindowReset() {
                    await new Promise(resolve => setTimeout(resolve, 775));
                    textWindow.style.display = "flex"; // テキストウィンドウのdisplayを元に戻す(flex)
                    textWindow.style.height = "250px"; // テキストウィンドウの高さを元に戻す
                    characterImage.className = "characterImage_box"; // キャラクターの背景を元に戻す
                    currentText.className = "currentText"; // 現在のテキストのクラスを元に戻す

                    optionBox1.className = "optionBox";
                    optionBox2.className = "optionBox";
                    optionBox1.style.display = "flex";
                    optionBox2.style.display = "flex";
    
                    await new Promise(resolve => setTimeout(resolve, 1075));
                    currentText.innerHTML = currentText.innerHTML.concat(passedTextList[currentIndex]); // 新しいテキストを挿入
                    currentIndex++;

                    if (!directOptionFlg) {
                        setTimeout(() => {
                            showText(passedTextList).then(resolve);
                        }, 100);
                    }
                }
                textWindowReset();
                
                optionSelectedFlg = false;
                nextTextNum += 1;
            } else {
                currentText.innerHTML = currentText.innerHTML.concat(passedTextList[currentIndex]); // 新しいテキストを挿入
                currentIndex++;
                setTimeout(() => {
                    if (!textSkipFlg) {
                        showText(passedTextList).then(resolve);
                    } else {
                        resolve();
                    }
                }, 100);
            }
        } else {
            if (playerTextFlg) {
                logAdd(passedTextList);
    
                currentIndex = 0; // テキストのindex番号をリセット
                textDisplayFlg = true; // Enterキー入力を受け付け
            } else {
                logAdd(passedTextList); // テキストをログに追加
    
                currentIndex = 0; // テキストのindex番号をリセット
                textDisplayFlg = true; // Enterキー入力を受け付け
    
                if (nextTextNum != 9999) { // 選択肢があるテキスト以外の場合 (通常テキスト)
                    setTimeout(() => {
                        async function nextButton_display() {
                            delayedDisplay();
                            await new Promise(resolve => setTimeout(resolve, 500));
                            firstNextButtonAnimation = true;
                        }
                        nextButton_display();
                    }, 200);
                }
            }
            resolve();
        }
    });
}

// テキストをログに追加
function logAdd(passedTextList, passedOptionAddition) {
    if (!narrationFlg) {
        let originalText = passedTextList.join("") // 分割したテキストを元に戻す
        let logTextBox = document.createElement("div"); // 新しく<div>要素を作成する
        let logText = document.createElement("p"); // セリフを入れる<p>要素を作成する
        let logNameTag = document.createElement("p"); // ネームタグを入れる<p>要素を作成する
        let optionAddition = document.createElement("p"); // 選択肢を選んだ場合のセリフに追加するテキストを入れる<p>要素を作成する

        logTextBox.className = "logTextBox"; // 作成した<div>要素にclassをつける
        logText.className = "logText"; // 作成したセリフを入れる<p>要素にclassをつける
        logNameTag.className = "logNameTag"; // 作成したネームタグを入れる<p>要素にclassをつける
        optionAddition.className = "optionAddition"; // 作成したセリフに追加するテキストにclassをつける

        logText.textContent = originalText;
        optionAddition.textContent = passedOptionAddition;

        // <div>要素にネームタグの<p>要素を追加
        logTextBox.appendChild(logNameTag);

        if (nameTagFlg || namelessFlg) {
            let logTextPlayerBox = document.createElement("div"); // 選択肢を選んだ場合のテキストを入れる<div>要素を作成

            logTextPlayerBox.style.display = "flex";
            optionAddition.style.color = "#fff";
            optionAddition.style.margin = "0 15px 0 0";

            logTextPlayerBox.appendChild(optionAddition);
            logTextPlayerBox.appendChild(logText);
            logTextBox.appendChild(logTextPlayerBox);

            if (namelessFlg) { // プレイヤー、キャラクター以外のセリフの場合
                logNameTag.textContent = nameTag.textContent;
                namelessFlg = false
            } else { // プレイヤーのセリフの場合
                logNameTag.textContent = playerName; // ネームタグにプレイヤー名を入れる

                let playerLogText = logNameTag.nextElementSibling; // プレイヤー名の兄弟要素(プレイヤーのセリフ)を取得
                playerLogText.style.color = "lightgreen"; // プレイヤーのセリフのスタイルを変更

                nameTagFlg = false
            }
        } else { // キャラクターのセリフの場合
            logTextBox.appendChild(logText);
            logNameTag.textContent = characterName; // ネームタグにキャラクター名を入れる
        }

        let logSidebarText = document.getElementById("log_sidebar_text"); // 作成した<div>要素と<p>要素を配置する親要素を取得
        logSidebarText.appendChild(logTextBox); // ログにテキストボックスを配置
    }
    narrationFlg = false;
}

// テキストが表示し終わってからボタンを表示する
function delayedDisplay() {
    document.getElementById("next_button").style.display = "block";
}

// ログを表示、非表示
function logAnimation() {
    let logSidebar = document.getElementById("log_sidebar");
    let logIcon = document.getElementById("log_icon");

    logSidebar.style.display = "block"; // ログの状態を"表示"に

    if (!logAnimationFlg) {
        if (!logSidebarFlg) { // ログを表示
            logNextFlg = true;
            logAnimationFlg = true;

            nextTextSound.play(); // mp3ファイルを再生
    
            async function logDisplayAnimation() {
                await new Promise(resolve => setTimeout(resolve, 100));
            
                logSidebar.className = "log_sidebar_animation"; // アニメーションを設定しているクラスに変更
            
                // ログボタンのスタイルを変更
                logIcon.src = "../img/icon/log_cancel.svg";
                logIcon.style.width = "30px";
                logIcon.style.margin = "15.5px 0 0 0";

                logAnimationFlg = false;
            }
            logDisplayAnimation();
        
            logSidebarFlg = true;
        } else {// ログを非表示
            logAnimationFlg = true;
            logNextFlg = false;

            logSidebar.className = "log_sidebar"; // 元のクラスに戻す
            logCloseSound.play(); // mp3ファイルを再生
        
            // ログボタンのスタイルを変更
            logIcon.src = "../img/icon/log_button_icon.svg";
            logIcon.style.width = "25px";
            logIcon.style.margin = "17.5px 0 0 0";
        
            async function logCloseAnimation() {
                await new Promise(resolve => setTimeout(resolve, 250));
                document.getElementById("log_box").style.display = "block"; // ログのボタンを表示
            
                await new Promise(resolve => setTimeout(resolve, 410));
                logSidebar.style.display = "none"; // ログを非表示

                logAnimationFlg = false;
            }
            logCloseAnimation();
        
            logSidebarFlg = false;
        }
    }
}

// 選択肢を表示
function optionDisplay(passedOptionText, option1, option2) {
    let textWindow = document.getElementById("text_window"); // テキストウィンドウを取得
    let option = document.getElementById("option"); // 選択肢を取得
    let optionText1 = document.getElementById("optionText1"); // 一つ目の選択肢を取得
    let optionText2 = document.getElementById("optionText2"); // 二つ目の選択肢を取得
    let currentText = document.getElementById("currentText"); // 現在のテキストを取得

    let optionTextList = [passedOptionText];
    let optionText = [option1, option2]; // 選択肢のテキスト

    textWindow.style.display = "block"; // テキストウィンドウのdisplayをflexからblockに変更
    currentText.className = "currentText_option"; // 表示されているテキストを選択肢バージョンに変更

    // 選択肢にテキストを挿入する
    optionText1.textContent = optionText[0];
    optionText2.textContent = optionText[1];

    playerTextFlg = true;
    setTimeout(() => {
        document.getElementById("characterImage_box").className = "characterImage_box_option" // キャラクターコンテナのクラスを変更
        async function optionText_display() {
            if (!directOptionFlg) {
                await showText(textDivision(optionTextList)) // テキストを次に進める
            }
            setTimeout(() => {
                textWindow.style.height = "350px"; // テキストウィンドウの高さを変更
                option.style.display = "block" // 選択肢を表示
                optionFlg = true;
            }, 250);
        }
        optionText_display();
    }, 500);
}

// 選択肢によって分岐
function option(num) {
    let optionBox1 = document.getElementById("optionBox1");
    let optionBox2 = document.getElementById("optionBox2");
    let optionTextAddition = "＞";
    let passedTextList = [];

    if (optionFlg) {
        nextTextSound.play(); // mp3ファイルを再生
        optionSelectedFlg = true;
        nameTagFlg = true;

        if (num == 1) {
            option1Flg = true;

            if (rootList.kitamuraRootFlg) {
                if (nextTextNum == 27) { // 好感度の変化
                    favourableImpression += 20;
                    kitamuraImage();
                } else if (nextTextNum == 31) {
                    favourableImpression += 20;
                    kitamuraImage();
                }
            } else if (rootList.hashidumeRootFlg) {
                if (nextTextNum == 36) {
                    optionSelected(false);
                } else if (nextTextNum == 55) {
                    favourableImpression -= 20;
                } else if (nextTextNum == 67) {
                    favourableImpression += 10;
                    optionSelected(false);
                }
            } else if (rootList.komatsuRootFlg) {
                if (nextTextNum == 24) {
                    favourableImpression += 20;
                } else if (nextTextNum == 27) {
                    favourableImpression += 10;
                }
            } else if (rootList.hukayaRootFlg) {
                if (nextTextNum == 27) {
                    favourableImpression += 20;
                } else if (nextTextNum == 43) {
                    favourableImpression += 20;
                }
            } else if (rootList.katuraRootFlg) {
                if (nextTextNum == 79) {
                    favourableImpression += 10;
                    optionSelected(false);
                } else if (nextTextNum == 91) {
                    favourableImpression -= 10;
                } else if (nextTextNum == 105) {
                    favourableImpression -= 30;
                }
            }

            textList = [deliveryTextList[0]];
            optionBox1.className = "optionBox_animation"; // 選択肢のクラスをアニメーションの設定されているクラスに変更
            optionBox2.style.display = "none"; // 選択していない選択肢を非表示
            passedTextList = [document.getElementById("optionText1").textContent];

            showText(textDivision(textList));
            logAdd(passedTextList, optionTextAddition);
        } else {
            option2Flg = true;

            if (rootList.kitamuraRootFlg) {
                if (nextTextNum == 25) { // 好感度の変化
                    favourableImpression += 10;
                    kitamuraImage();
                } else if (nextTextNum == 31) {
                    favourableImpression -= 30;
                    kitamuraImage();
                } else if (nextTextNum == 41) {
                    favourableImpression += 20;
                    kitamuraImage();
                }
            } else if (rootList.hashidumeRootFlg) {
                if (nextTextNum == 36) {
                    optionSelected(false);
                } else if (nextTextNum == 55) {
                    favourableImpression += 20;
                } else if (nextTextNum == 67) {
                    favourableImpression -= 10;
                    optionSelected(false);
                } else if (nextTextNum == 75) {
                    favourableImpression += 10;
                }
            } else if (rootList.komatsuRootFlg) {
                if (nextTextNum == 21) {
                    favourableImpression += 20;
                }
            } else if (rootList.hukayaRootFlg) {
                if (nextTextNum == 27) {
                    favourableImpression -= 10;
                } else if (nextTextNum == 43) {
                    favourableImpression += 20;
                }
            } else if (rootList.katuraRootFlg) {
                if (nextTextNum == 79) {
                    favourableImpression += 20;
                    optionSelected(false);
                } else if (nextTextNum == 91) {
                    favourableImpression += 20;
                }
            }

            textList = [deliveryTextList[1]];
            optionBox2.className = "optionBox_animation"; // 選択肢のクラスをアニメーションの設定されているクラスに変更
            optionBox1.style.display = "none"; // 選択していない選択肢を非表示

            passedTextList = [document.getElementById("optionText2").textContent];
            showText(textDivision(textList));
            logAdd(passedTextList, optionTextAddition);
        }

        setTimeout(() => {
            document.getElementById("option").style.display = "none"; // 選択肢を遅延して非表示
        }, 750);
    
        directOptionFlg = false;
        playerTextFlg = false;
        optionFlg = false;
    }
}

// キタムラルートのみキャラ画像の変遷
function kitamuraImage() {
    let kitamuraImageUrl = "../img/character/Kitamura/Kitamura_";
    let kitamuraImageSrc = document.getElementById("characterImage").src;

    kitamuraImageSrc = `${kitamuraImageUrl + String(favourableImpression)}%25.png`;
    document.getElementById("characterImage").src = kitamuraImageSrc;

    deliveryImage = kitamuraImageSrc;
}

// ハシヅメルートのみネームタグの変更タイミング調整
function optionSelected(bool) {
    if (bool) {
        nameTag.textContent = playerName;
    } else {
        nameTag.textContent = characterName;
    }
}