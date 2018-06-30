//引入vscode扩展
import * as vscode from 'vscode';
import { MarkDown, MarkDownViewController } from './markdown';
import { WordCounter, WordCounterController } from './wordCounter';

// This method is called when your extension is activated. Activation is
// controlled by the activation events defined in package.json.
export function activate(context: vscode.ExtensionContext) {

    console.log('Congratulations, your extension "wool-markdown" is now active!');

    let markDown: MarkDown = new MarkDown(context);

    let prewiew = vscode.commands.registerCommand('extension.openPrewiew', () => {
        vscode.window.showInformationMessage('预览模式已打开');
        markDown.updateMarkdown();
    });

    let wordCounter = new WordCounter();
    let controller = new WordCounterController(wordCounter);
    let markDownViewController = new MarkDownViewController(markDown);
    context.subscriptions.push(controller);
    context.subscriptions.push(wordCounter);
    context.subscriptions.push(markDownViewController);
    context.subscriptions.push(prewiew);

}