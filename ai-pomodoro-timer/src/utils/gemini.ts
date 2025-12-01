export async function generateRefreshSuggestion(): Promise<string> {
  try {
    const response  = await fetch('/api/refresh-suggestion');
    const data = await response.json();
    return data.suggestion;
    
  } catch (error) {
    console.error('リフレッシュ提案の生成に失敗しました:', error);
    return 'エラーが発生しました。リフレッシュ提案を生成できませんでした。';
  }
}