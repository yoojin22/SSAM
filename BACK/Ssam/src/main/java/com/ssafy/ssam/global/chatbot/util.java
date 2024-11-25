package com.ssafy.ssam.global.chatbot;

import java.time.LocalDateTime;

public class util {
    public static String AnswerPrompt =
            "Today is "+ LocalDateTime.now()+
            "Your answer should be given in Korean based on the correspondence of the home correspondence divided into ---------- below.\n" +
            "You speak is the teacher's way of guiding your parents. \n" +
            "if you find answer in All content, tell me answer.\n" +
            "But if user ask a question that you can't answer with All content, you should answer same word, \"정확한 답변을 할 수 없습니다.문의사항을 남기시겠어요?\"";
    public static String imageUploadPrompt =
            "When the teacher uploads the school newsletter, we use the information written here GPT is trying to create a function that guides parents. Therefore, the content should contain all the details, and it should be information that GPT can read and answer based on rather than information organized so that people can easily understand it. \n" +
            "If it's a school meal ticket,  such as day of the week, week, school name, nutritionist, etc. will not included in the results, but is provided in the following formata MMDD, breakfast/lunch/dinner/snack, Korean name of all menus\n" +
            "Please give all the contents of the image in Korean without a summary\n";

    public static String summaryPrompt(String topic) {
        return "When making a reservation, refer to the topic of "+topic+" entered by parents and classify the conversation received by STT\n" +
                        "Teachers should be able to see this file and see at a glance the important elements of the conversation they had with their parents. The output includes a lot of parents' concerns or mentioning a specific person, and includes minimal information about their daily lives.\n" +
                        "Also, if you are open to criticism with aggressive language towards the teacher or if there is a word for the purpose of slander, please count and fill the level of the entire conversation\n" +
                        "When the stages of verbal abuse are divided into 0 to 5\n" +
                        "Level 0: Normal Conversation\n" +
                        "Words and expressions: language with respect and courtesy\n" +
                        "Examples: \"OK,\" \"Thank you,\" \"I have a question.\"\n" +
                        "Level 1: Growing complaints from parents, flippers to protect their child\n" +
                        "Words and expressions: words that express some dissatisfaction\n" +
                        "Examples: \"It's kind of weird,\" \"I disagree,\" \"My kid's not the type to do that.\" \"I'm disappointed in the teacher,\" \"I don't understand,\" \"It's unfair.\"\n" +
                        "\"Didn't you get it wrong?\"\n" +
                        "Level 3: Serious complaints and tension\n" +
                        "Words and expressions: words that may include personal attacks, stronger signs of dissatisfaction, and remarks that ignore the teacher's experience\n" +
                        "a rude conversation in which the language of the teacher refers to you, etc\n" +
                        "the act of scaring one's superiors\n" +
                        "Examples: \"I'm not responsible,\" \"It's a mistake,\" \"I suspect professionalism,\" \"Bring in.\" \"Even if you're a teacher, this is a home education.\"\n" +
                        "\"Who is my father?\" \"Do you know the principal or the scholar?\"\n" +
                        "\"That's why~\"\n" +
                        "Level 5: Severe verbal abuse, including aggressive and accusatory words, warnings and threats\n" +
                        "Words and expressions: swearing, grossly offensive language, extreme criticism and intimidation\n" +
                        "Examples: \"Fuck\" \"Get off,\" \"Trash,\" \"Bitch like you,\" \"Incompetent,\" \"Sick.\"\n" +
                        ", 'out of my sight.' 'Get rid of the nonsense.'\n" +
                        "divide by etc\n" +
                        "The results are more than 150 characters in Korean. At this time, if there are multiple contents in one result value, it is not a list, so don't use '[', ']', only availble a \",\" and provides one result.\n" +
                        "And json types\n" +
                        "'요약' : 'A one-line summary of the entire conversation'\n" +
                        "'부모 우려' : ''\n" +
                        "'교사 추천' : ''\n" +
                        "'후속 예약날짜' : 'yyyymmdd, If there is no follow-up reservation date, blank\n'" +
                        "'욕설 횟수' : 'count number'\n" +
                        "'욕설 수준' : 'Total level just Integer'";
    }
}
