import * as vscode from 'vscode';

export class WordCounter {
    //创建一个状态栏标识
    private _statusBarItem: vscode.StatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);

    public updateWordCount() {

        // 获取当前编辑栏
        let editor = vscode.window.activeTextEditor;
        if (!editor) {
            this._statusBarItem.hide();
            return;
        }

        let doc = editor.document;

        // 在语言为markdown时执行
        if (doc.languageId === "markdown") {
            let wordCount = this._getWordCount(doc);

            // 更新状态栏
            this._statusBarItem.text = wordCount !== 1 ? `${wordCount} 个词` : '1 个词';
            this._statusBarItem.show();
        } else {
            this._statusBarItem.hide();
        }
    }

    public _getWordCount(doc: vscode.TextDocument): number {

        let docContent = doc.getText();

        // 空格分词
        docContent = docContent.replace(/(< ([^>]+)<)/g, '').replace(/\s+/g, ' ');
        docContent = docContent.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
        let wordCount = 0;
        if (docContent !== "") {
            wordCount = docContent.split(" ").length;
        }

        return wordCount;
    }

    dispose() {
        this._statusBarItem.dispose();
    }
}

export class WordCounterController {

    private _wordCounter: WordCounter;
    private _disposable: vscode.Disposable;

    constructor(wordCounter: WordCounter) {
        this._wordCounter = wordCounter;

        // 订阅事件
        let subscriptions: vscode.Disposable[] = [];
        //编辑器键盘监听事件
        vscode.window.onDidChangeTextEditorSelection(this._onEvent, this, subscriptions);
        vscode.window.onDidChangeActiveTextEditor(this._onEvent, this, subscriptions);

        //执行一次更新数量
        this._wordCounter.updateWordCount();

        // 创建一个组合销毁所有事件
        this._disposable = vscode.Disposable.from(...subscriptions);
    }

    dispose() {
        this._disposable.dispose();
    }

    private _onEvent() {
        this._wordCounter.updateWordCount();
    }
}