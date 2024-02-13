const languages = {
    en: {
        notAllowLocation: 'I do not allow reading locations',
        notAllowReconizeAudio: 'I do not allow recognizing audio',
        notAllowReconizeImage: 'I do not allow recognizing images',
        notAllowReconizePdf: 'I do not allow recognizing pdf',
        listeningToAudio: 'Listening to audio',
        instructionsGetIsoLanguaje:
            '[INSTRUCTIONS]: Identifies the text before [INSTRUCTIONS] returns the language in ISO format at the end in {} example {es}',
        instructionsPdf:
            'Could you provide brief and accurate conclusions? Do not search the web and use only the content of the document. Factual information must come literally from the document. Memorize the part of the document that mentions the objective information, but do not mark it explicitly. The conclusion must be credible, very readable and informative. Please write a brief response, preferably no more than 1000 characters. Generate the response in the language I have spoken before',
        errorProcessingAudio: 'Error processing audio try again',
        errorInBot: 'An error occurred',
        restartConversation: 'Restart conversation',
        waitResponse: 'Waiting for response from',
        oneMessageAtTime: 'Only one message at a time',
    },
    es: {
        notAllowLocation: 'No permito leer ubicaciones',
        notAllowReconizeAudio: 'No permito reconocer audio',
        notAllowReconizeImage: 'No permito reconocer imagenes',
        notAllowReconizePdf: 'No permito reconocer PDF',
        listeningToAudio: 'Escuchando audio',
        instructionsGetIsoLanguaje:
            '[INSTRUCCIONES]: Identifica el texto antes de [INSTRUCCIONES] devuelve el idioma en formato ISO al final entre {} ejemplo {es}',
        instructionsPdf:
            '¿Podría proporcionar conclusiones breves y precisas? No busque en la web y utilice únicamente el contenido del documento. La información fáctica debe provenir literalmente del documento. Memorice la parte del documento que menciona la información objetiva, pero no la marque explícitamente. La conclusión debe ser creíble, muy legible e informativa. Por favor, escriba una respuesta breve, preferiblemente de no más de 1000 caracteres. Generar la respuesta en idioma que he hablado anteriormente',
        errorProcessingAudio: 'Error al procesar audio intenta de nuevo',
        errorInBot: 'Ocurrió un error',
        restartConversation: 'Reiniciar conversación',
        waitResponse: 'Esperando respuesta de',
        oneMessageAtTime: 'Solo un mensaje a la vez',
    },
    fr: {
        notAllowLocation: 'Je ne permets pas de lire les emplacements',
        notAllowReconizeAudio: "Je ne permets pas de reconnaître l'audio",
        notAllowReconizeImage: 'Je ne permets pas de reconnaître les images',
        notAllowReconizePdf: 'Je ne permets pas de reconnaître les pdf',
        listeningToAudio: "Écoute de l'audio",
        instructionsGetIsoLanguaje:
            '[INSTRUCTIONS]: Identifiez le texte avant [INSTRUCTIONS] renvoie la langue au format ISO à la fin entre {} exemple {es}',
        instructionsPdf:
            "Pourriez-vous fournir des conclusions brèves et précises? Ne cherchez pas sur le web et utilisez uniquement le contenu du document. Les informations factuelles doivent provenir littéralement du document. Mémorisez la partie du document qui mentionne les informations objectives, mais ne la marquez pas explicitement. La conclusion doit être crédible, très lisible et informative. Veuillez écrire une réponse brève, de préférence pas plus de 1000 caractères. Générer la réponse dans la langue que j'ai parlée précédemment",
        errorProcessingAudio: 'Erreur de traitement audio réessayer',
        errorInBot: "Une erreur s'est produite",
        restartConversation: 'Redémarrer la conversation',
        waitResponse: 'En attente de réponse de',
        oneMessageAtTime: 'Un seul message à la fois',
    },
    zh: {
        notAllowLocation: '我不允许阅读位置',
        notAllowReconizeAudio: '我不允许识别音频',
        notAllowReconizeImage: '我不允许识别图像',
        notAllowReconizePdf: '我不允许识别pdf',
        listeningToAudio: '收听音频',
        instructionsGetIsoLanguaje: '[说明]：在[说明]之前识别文本，最后返回ISO格式的语言，例如{es}',
        instructionsPdf:
            '您能提供简明准确的结论吗？不要在网上搜索，只使用文档的内容。事实信息必须从文档中直接获得。记住文档中提到客观信息的部分，但不要明确标记它。结论必须可信，易读且信息丰富。请写出简要回答，最好不超过1000个字符。用我之前说过的语言生成回答',
        errorProcessingAudio: '处理音频时出错，请重试',
        errorInBot: '发生错误',
        restartConversation: '重新开始对话',
        waitResponse: '等待回复',
        oneMessageAtTime: '一次只能发送一条消息',
    },
    it: {
        notAllowLocation: 'Non permetto la lettura delle posizioni',
        notAllowReconizeAudio: "Non permetto di riconoscere l'audio",
        notAllowReconizeImage: 'Non permetto di riconoscere le immagini',
        notAllowReconizePdf: 'Non permetto di riconoscere i pdf',
        listeningToAudio: "Ascolto dell'audio",
        instructionsGetIsoLanguaje:
            '[ISTRUZIONI]: Identifica il testo prima di [ISTRUZIONI] restituisce la lingua in formato ISO alla fine tra {} esempio {es}',
        instructionsPdf:
            'Potresti fornire conclusioni brevi e accurate? Non cercare su Internet e utilizza solo il contenuto del documento. Le informazioni fattuali devono provenire letteralmente dal documento. Memorizza la parte del documento che menziona le informazioni oggettive, ma non la contrassegnare esplicitamente. La conclusione deve essere credibile, molto leggibile e informativa. Si prega di scrivere una risposta breve, preferibilmente non più di 1000 caratteri. Genera la risposta nella lingua che ho parlato prima',
        errorProcessingAudio: 'Errore di elaborazione audio riprova',
        errorInBot: 'Si è verificato un errore',
        restartConversation: 'Riavvia la  conversazione',
        waitResponse: 'In attesa di risposta da',
        oneMessageAtTime: 'Un solo messaggio alla volta',
    },
    pt: {
        notAllowLocation: 'Não permito ler locais',
        notAllowReconizeAudio: 'Não permito reconhecer áudio',
        notAllowReconizeImage: 'Não permito reconhecer imagens',
        notAllowReconizePdf: 'Não permito reconhecer pdf',
        listeningToAudio: 'Ouvindo áudio',
        instructionsGetIsoLanguaje:
            '[INSTRUÇÕES]: Identifica o texto antes de [INSTRUÇÕES] retorna o idioma no formato ISO no final entre {} exemplo {es}',
        instructionsPdf:
            'Você poderia fornecer conclusões breves e precisas? Não pesquise na web e use apenas o conteúdo do documento. As informações factuais devem vir literalmente do documento. Memorize a parte do documento que menciona as informações objetivas, mas não a marque explicitamente. A conclusão deve ser credível, muito legível e informativa. Por favor, escreva uma resposta breve, de preferência com no máximo 1000 caracteres. Gere a resposta no idioma que falei anteriormente',
        errorProcessingAudio: 'Erro ao processar áudio tente novamente',
        errorInBot: 'Ocorreu um erro',
        restartConversation: 'Reiniciar conversa',
        waitResponse: 'Aguardando resposta de',
        oneMessageAtTime: 'Apenas uma mensagem de cada vez',
    },
    ja: {
        notAllowLocation: '位置を読むことを許可しません',
        notAllowReconizeAudio: 'オーディオの認識を許可しません',
        notAllowReconizeImage: '画像の認識を許可しません',
        notAllowReconizePdf: 'PDFの認識を許可しません',
        listeningToAudio: 'オーディオを聞いています',
        instructionsGetIsoLanguaje:
            '[手順]: [手順]の前にテキストを識別し、最後に{}の間にISO形式の言語を返します。例{es}',
        instructionsPdf:
            '簡潔で正確な結論を提供できますか？ウェブで検索せず、文書の内容のみを使用してください。事実情報は文書から直接取得する必要があります。文書で客観的な情報を言及している部分を記憶してくださいが、明示的にマークしないでください。結論は信頼性があり、非常に読みやすく、情報が豊富である必要があります。1000文字を超えないでください。前に話した言語で回答を生成してください',
        errorProcessingAudio: 'オーディオの処理中にエラーが発生しました。もう一度やり直してください',
        errorInBot: 'エラーが発生しました',
        restartConversation: '会話を再開する',
        waitResponse: 'からの応答を待っています',
        oneMessageAtTime: '一度に1つのメッセージのみ',
    },
    ko: {
        notAllowLocation: '위치를 읽을 수 없습니다',
        notAllowReconizeAudio: '오디오 인식을 허용하지 않습니다',
        notAllowReconizeImage: '이미지 인식을 허용하지 않습니다',
        notAllowReconizePdf: 'PDF 인식을 허용하지 않습니다',
        listeningToAudio: '오디오를 듣고 있습니다',
        instructionsGetIsoLanguaje:
            '[지침]: [지침] 앞의 텍스트를 식별하고 마지막에 {} 사이에 ISO 형식의 언어를 반환합니다. 예 {es}',
        instructionsPdf:
            '간결하고 정확한 결론을 제공할 수 있습니까? 웹에서 검색하지 말고 문서의 내용만 사용하십시오. 사실 정보는 문서에서 직접 가져와야합니다. 문서에서 객관적 정보를 언급하는 부분을 기억하되 명시적으로 표시하지 마십시오. 결론은 신뢰할 수 있고 매우 읽기 쉽고 정보가 풍부해야합니다. 가능한 1000자 이내로 간단한 답변을 작성하십시오. 이전에 말한 언어로 응답을 생성하십시오',
        errorProcessingAudio: '오디오 처리 중 오류가 발생했습니다. 다시 시도하십시오',
        errorInBot: '오류가 발생했습니다',
        restartConversation: '대화 다시 시작',
        waitResponse: '에서 응답을 기다리는 중',
        oneMessageAtTime: '한 번에 한 메시지 만',
    },
}

export default languages
