var task2Q = {
    type: 'html-keyboard-response',
    stimulus: function() {
        html =  '<p>You are finished the main part of the study!</p>';
        html += '<p>We just have a few questions for you to answer and then you will be done for today. Please answer these questions honestly.</p>';
        html += '<p>Press SPACE to continue.</p>';
        return html
    },
    choices: ['space'], 
    on_finish: function() {
      document.body.style.background = "white";
      document.body.style.color = 'black'   
    }
};

var demographics = {
  type: 'survey-text',
  questions: [
    {prompt: "For statistical purposes, how old are you? (please type out in years)", name:'age', required: true},
    {prompt: "For statistical purposes, What is your gender? (please type out your answer below)", name:'gender', required: true}
      ],
  preamble: 'Please answer these questions.',
  on_finish: function(data) {
    jsPsych.data.addProperties({
      age:    JSON.parse(data.responses)['age'],
      gender: JSON.parse(data.responses)['gender']
    });

  }
};


var debrief_questions = {
  type: 'survey-text',
  questions: [
    {prompt: "Do you have any comments you would like to share?", name:'comments', required: true},
      ],
  preamble: 'Please answer these questions.',
  on_finish: function(data) {
    jsPsych.data.addProperties({
      comments: JSON.parse(data.responses)['comments']
    });
  }
};



var NFC = {
  // see https://centerofinquiry.org/uncategorized/need-for-cognition-scale-wabash-national-study/
  type: 'survey-likert',
  questions: [
    {prompt: "I would prefer complex to simple problems.", name:'NFC1', required: true, labels:['Extremely uncharacteristic','2','3','4','Extremely characteristic']},
    {prompt: "I like to have the responsibility of handling a situation that requires a lot of thinking.", name:'NFC2', required: true, labels:['Extremely uncharacteristic','2','3','4','Extremely characteristic']},
    {prompt: "Thinking is not my idea of fun.", name:'NFC3', required: true, labels:['Extremely uncharacteristic','2','3','4','Extremely characteristic']},
    {prompt: "I would rather do something that requires little thought than something that is sure to challenge my thinking abilities.", name:'NFC4', required: true, labels:['Extremely uncharacteristic','2','3','4','Extremely characteristic']},
    {prompt: "I try to anticipate and avoid situations where there is likely a chance I will have to think in depth about something.", name:'NFC5', required: true, labels:['Extremely uncharacteristic','2','3','4','Extremely characteristic']},
    {prompt: "I find satisfaction in deliberating hard and for long hours.", name:'NFC6', required: true, labels:['Extremely uncharacteristic','2','3','4','Extremely characteristic']},
    {prompt: "I would prefer complex to simple problems.", name:'NFC1', required: true, labels:['Extremely uncharacteristic','2','3','4','Extremely characteristic']},
    {prompt: "I only think as hard as I have to.", name:'NFC7', required: true, labels:['Extremely uncharacteristic','2','3','4','Extremely characteristic']},
    {prompt: "I prefer to think about small, daily projects to long-term ones.", name:'NFC8', required: true, labels:['Extremely uncharacteristic','2','3','4','Extremely characteristic']},
    {prompt: "I like tasks that require little thought once I’ve learned them.", name:'NFC9', required: true, labels:['Extremely uncharacteristic','2','3','4','Extremely characteristic']},
    {prompt: "The idea of relying on thought to make my way to the top appeals to me.", name:'NFC10', required: true, labels:['Extremely uncharacteristic','2','3','4','Extremely characteristic']},
    {prompt: "I really enjoy a task that involves coming up with new solutions to problems.", name:'NFC11', required: true, labels:['Extremely uncharacteristic','2','3','4','Extremely characteristic']},
    {prompt: "Learning new ways to think doesn’t excite me very much.", name:'NFC12', required: true, labels:['Extremely uncharacteristic','2','3','4','Extremely characteristic']},
    {prompt: "I prefer my life to be filled with puzzles that I must solve.", name:'NFC13', required: true, labels:['Extremely uncharacteristic','2','3','4','Extremely characteristic']},
    {prompt: "The notion of thinking abstractly is appealing to me.", name:'NFC14', required: true, labels:['Extremely uncharacteristic','2','3','4','Extremely characteristic']},
    {prompt: "I would prefer a task that is intellectual, difficult, and important to one that is somewhat important but does not require much thought.", name:'NFC15', required: true, labels:['Extremely uncharacteristic','2','3','4','Extremely characteristic']},
    {prompt: "I feel relief rather than satisfaction after completing a task that required a lot of mental effort.", name:'NFC16', required: true, labels:['Extremely uncharacteristic','2','3','4','Extremely characteristic']},
    {prompt: "It’s enough for me that something gets the job done; I don’t care how or why it works.", name:'NFC17', required: true, labels:['Extremely uncharacteristic','2','3','4','Extremely characteristic']},
    {prompt: "I usually end up deliberating about issues even when they do not affect me personally.", name:'NFC18', required: true, labels:['Extremely uncharacteristic','2','3','4','Extremely characteristic']}
      ],
  preamble: 'For each of the statements below, please indicate to what extent the statement is characteristic of you. The rating scale is as follows: 1 = extremely uncharacteristic, 2 = somewhat uncharacteristic, 3 = uncertain, 4 = somewhat characteristc, 5 = extremely characteristic',
  scale_width: 500, 
  on_finish: function(data) {
    jsPsych.data.addProperties({
      NFC1:     JSON.parse(data.responses)['NFC1'],
      NFC2:     JSON.parse(data.responses)['NFC2'],
      NFC3:     JSON.parse(data.responses)['NFC3'],
      NFC4:     JSON.parse(data.responses)['NFC4'],
      NFC5:     JSON.parse(data.responses)['NFC5'],
      NFC6:     JSON.parse(data.responses)['NFC6'],
      NFC7:     JSON.parse(data.responses)['NFC7'],
      NFC8:     JSON.parse(data.responses)['NFC8'],
      NFC9:     JSON.parse(data.responses)['NFC9'],
      NFC10:    JSON.parse(data.responses)['NFC10'],
      NFC11:    JSON.parse(data.responses)['NFC11'],
      NFC12:    JSON.parse(data.responses)['NFC12'],
      NFC13:    JSON.parse(data.responses)['NFC13'],
      NFC14:    JSON.parse(data.responses)['NFC14'],
      NFC15:    JSON.parse(data.responses)['NFC15'],
      NFC16:    JSON.parse(data.responses)['NFC16'],
      NFC17:    JSON.parse(data.responses)['NFC17'],
      NFC18:    JSON.parse(data.responses)['NFC18']
    });
  }
};

var UPPSP = {
  // see https://scienceofbehaviorchange.org/measures/upps-p-impulsive-behavior-scale/
  type: 'survey-likert',
  questions: [
    {prompt: "I generally like to see things through to the end.", name:'UPPSP1', required: true, labels:['Agree Strongly','2','3','Disagree Strongly']},
    {prompt: "My thinking is usually careful and purposeful.", name:'UPPSP2', required: true, labels:['Agree Strongly','2','3','Disagree Strongly']},
    {prompt: "When I am in great mood, I tend to get into situations that could cause me problems.", name:'UPPSP3', required: true, labels:['Agree Strongly','2','3','Disagree Strongly']},
    {prompt: "Unfinished tasks really bother me.", name:'UPPSP4', required: true, labels:['Agree Strongly','2','3','Disagree Strongly']},
    {prompt: "I like to stop and think things over before I do them.", name:'UPPSP5', required: true, labels:['Agree Strongly','2','3','Disagree Strongly']},
    {prompt: "When I feel bad, I will often do things I later regret in order to make myself feel better now.", name:'UPPSP6', required: true, labels:['Agree Strongly','2','3','Disagree Strongly']},
    {prompt: "Once I get going on something I hate to stop.", name:'UPPSP7', required: true, labels:['Agree Strongly','2','3','Disagree Strongly']},
    {prompt: "Sometimes when I feel bad, I can't seem to stop what I am doing even though it is making me feel worse.", name:'UPPSP8', required: true, labels:['Agree Strongly','2','3','Disagree Strongly']},
    {prompt: "I quite enjoy taking risks.", name:'UPPSP9', required: true, labels:['Agree Strongly','2','3','Disagree Strongly']},
    {prompt: "I tend to lose control when I am in a great mood.", name:'UPPSP10', required: true, labels:['Agree Strongly','2','3','Disagree Strongly']},
    {prompt: "I finish what I start.", name:'UPPSP11', required: true, labels:['Agree Strongly','2','3','Disagree Strongly']},
    {prompt: "I tend to value and follow a rational, “sensible” approach to things.", name:'UPPSP12', required: true, labels:['Agree Strongly','2','3','Disagree Strongly']},
    {prompt: "When I am upset I often act without thinking.", name:'UPPSP13', required: true, labels:['Agree Strongly','2','3','Disagree Strongly']},
    {prompt: "I welcome new and exciting experiences and sensations, even if they are a little frightening and unconventional.", name:'UPPSP14', required: true, labels:['Agree Strongly','2','3','Disagree Strongly']},
    {prompt: "When I feel rejected, I will often say things that I later regret.", name:'UPPSP15', required: true, labels:['Agree Strongly','2','3','Disagree Strongly']},
    {prompt: "I would like to learn to fly an airplane.", name:'UPPSP16', required: true, labels:['Agree Strongly','2','3','Disagree Strongly']},
    {prompt: "Others are shocked or worried about the things I do when I am feeling very excited.", name:'UPPSP17', required: true, labels:['Agree Strongly','2','3','Disagree Strongly']},
    {prompt: "I would enjoy the sensation of skiing very fast down a high mountain slope.", name:'UPPSP18', required: true, labels:['Agree Strongly','2','3','Disagree Strongly']},
    {prompt: "I usually think carefully before doing anything.", name:'UPPSP19', required: true, labels:['Agree Strongly','2','3','Disagree Strongly']},
    {prompt: "I tend to act without thinking when I am really excited.", name:'UPPSP20', required: true, labels:['Agree Strongly','2','3','Disagree Strongly']}
      ],
  preamble: 'For each of the statements below, please indicate how much you agree or disagree with the statement. The rating scale is as follows: 1 = Agree Strongly, 2 = Agree Some, 3 = Disagree Some, 4 = Disagree Strongly',
  scale_width: 500, 
  on_finish: function(data) {
    jsPsych.data.addProperties({
      UPPSP1:     JSON.parse(data.responses)['UPPSP1'],
      UPPSP2:     JSON.parse(data.responses)['UPPSP2'],
      UPPSP3:     JSON.parse(data.responses)['UPPSP3'],
      UPPSP4:     JSON.parse(data.responses)['UPPSP4'],
      UPPSP5:     JSON.parse(data.responses)['UPPSP5'],
      UPPSP6:     JSON.parse(data.responses)['UPPSP6'],
      UPPSP7:     JSON.parse(data.responses)['UPPSP7'],
      UPPSP8:     JSON.parse(data.responses)['UPPSP8'],
      UPPSP9:     JSON.parse(data.responses)['UPPSP9'],
      UPPSP10:    JSON.parse(data.responses)['UPPSP10'],
      UPPSP11:    JSON.parse(data.responses)['UPPSP11'],
      UPPSP12:    JSON.parse(data.responses)['UPPSP12'],
      UPPSP13:    JSON.parse(data.responses)['UPPSP13'],
      UPPSP14:    JSON.parse(data.responses)['UPPSP14'],
      UPPSP15:    JSON.parse(data.responses)['UPPSP15'],
      UPPSP16:    JSON.parse(data.responses)['UPPSP16'],
      UPPSP17:    JSON.parse(data.responses)['UPPSP17'],
      UPPSP18:    JSON.parse(data.responses)['UPPSP18'],
      UPPSP19:    JSON.parse(data.responses)['UPPSP19'],
      UPPSP20:    JSON.parse(data.responses)['UPPSP20'],
    });
  }
};

var WQ = {
  type: 'survey-likert',
  questions:[
    {prompt: "One has to finish things one started.", name:'WQ1', required: true, labels:['Do Not Agree','','','','50','','','','Fully Agree']},
    {prompt: "It is important to me not to be perceived as wasteful.", name:'WQ2', required: true, labels:['Do Not Agree','','','','50','','','','Fully Agree']},
    {prompt: "Investments taken in vain hurt me.", name:'WQ3', required: true, labels:['Do Not Agree','','','','50','','','','Fully Agree']},
    {prompt: "If a project does not go well, I simply start a new one.", name:'WQ4', required: true, labels:['Do Not Agree','','','','50','','','','Fully Agree']},
    {prompt: "People who know me would describe me as wasteful.", name:'WQ5', required: true, labels:['Do Not Agree','','','','50','','','','Fully Agree']},
    {prompt: "I will finish a project I started, no matter the cost.", name:'WQ6', required: true, labels:['Do Not Agree','','','','50','','','','Fully Agree']},
    {prompt: "If investments are unsuccessful, I get upset.", name:'WQ7', required: true, labels:['Do Not Agree','','','','50','','','','Fully Agree']},
    {prompt: "It happens that I hold on to projects only because I have already invested in them.", name:'WQ8', required: true, labels:['Do Not Agree','','','','50','','','','Fully Agree']}
  ],
  preamble: 'For each statement below, please mark how strongly you agree or disagree with it. All items are on a 0-100 scale (in steps of 10) where 0 = Do Not Agree and 100 = Fully Agree.',
  scale_width: 500,
  on_finish: function(data) {
    jsPsych.data.addProperties({
      WQ1: JSON.parse(data.responses)['WQ1'],
      WQ2: JSON.parse(data.responses)['WQ2'],
      WQ3: JSON.parse(data.responses)['WQ3'],
      WQ4: JSON.parse(data.responses)['WQ4'],
      WQ5: JSON.parse(data.responses)['WQ5'],
      WQ6: JSON.parse(data.responses)['WQ6'],
      WQ7: JSON.parse(data.responses)['WQ7'],
      WQ8: JSON.parse(data.responses)['WQ8'],
    });
  }
};

