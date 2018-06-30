import * as vscode from 'vscode';
export class MarkDown {
    private _currentPanel: vscode.WebviewPanel | undefined = undefined;
    private _context: vscode.ExtensionContext | undefined = undefined

    constructor(context: vscode.ExtensionContext) {
        this._context = context
    }

    public updateMarkdown() {
        if (this._currentPanel) {
            this._currentPanel.webview.html = this._getWebviewContent();
        } else {
            this._currentPanel = vscode.window.createWebviewPanel(
                'prewiew',
                "Prewiew",
                vscode.ViewColumn.Two,
                {}
            );
            this._currentPanel.webview.html = this._getWebviewContent();

            if (this._context) {
                this._currentPanel.onDidDispose(() => {
                    this._currentPanel = undefined;
                }, null, this._context.subscriptions);
            }
        }

    }

    public _getWebviewContent(): string {
        let editor = vscode.window.activeTextEditor;
        if (!editor) {
            return '';
        }
        let docContent = editor.document.getText();
        return `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Prewiew</title>
            </head>
            <body>
                ${docContent}
            </body>
            </html>`;
    }
}

export class MarkDownViewController {

    private _markDown: MarkDown;
    private _disposable: vscode.Disposable;

    constructor(markDown: MarkDown) {
        this._markDown = markDown;
        // 订阅事件
        let subscriptions: vscode.Disposable[] = [];
        //编辑器键盘监听事件
        vscode.window.onDidChangeTextEditorSelection(this._onEvent, this, subscriptions);
        vscode.window.onDidChangeActiveTextEditor(this._onEvent, this, subscriptions);

        // 创建一个组合销毁所有事件
        this._disposable = vscode.Disposable.from(...subscriptions);
    }

    dispose() {
        this._disposable.dispose();
    }

    private _onEvent() {
        this._markDown.updateMarkdown();
    }
}