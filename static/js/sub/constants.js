var PROL_ID = jsPsych.data.getURLVariable('PROLIFIC_PID');
var CTBL = _.sample([0,1,2,3]); 
jsPsych.data.addProperties({
  subject: Math.random().toString(36).slice(2), 
  date: Date(),
  prol_id: PROL_ID,
  ctbl: CTBL
});

const DEBUGMODE         = false;                                                 // whether to skip instructions + practice (for debugging) 
const STIM_PATH = 'static/images/stim/';                                                       // path to get stimuli
//const math_probs = pd.read_csv(`${STIM_PATH}math_probs.csv`);                    // read math problems (csv)
//const CONDS = pd.read_csv(`${STIM_PATH}conditions.csv`);                         // read test conditions (csv)
const N_REP = 4;                                                                 // # of repetitions in the experiment (TO BE DETERMINED) 
const OUT_PATH = 'data_online/';                                                        // path to save data
const I_KEYS = ['n', 'y'];                                                       // keys for whether to make an investment
const M_KEYS = ['q', 'w', 'e'];                                                  // keys to choose the answer of a math problem
const ITI = 1.0; // in seconds                                                   // post trial gap
const I_DUR = 5.0; // in seconds                                                 // time limit to make an investment
const M_P_DUR = 3.0; // in seconds                                               // time limit to answer a math problem in the prior phase
const M_A_DUR = 3.0; // in seconds                                               // time limit to answer a math problem in the after phase
const FB_DUR = 1.5; // in seconds                                                // duration to display whether the project is successful



// add one catch per learning phase rep
counter = 0; 
tmp1    = _.shuffle(Array(Math.round(NUM_LEARN/2)).fill([0,1]).flat()); 
tmp2    = _.shuffle(Array(Math.round(NUM_LEARN/2)).fill([0,1]).flat()); 
for(let i=0; i<LEARNING_LIST.length; i++) {
  if(LEARNING_LIST[i]==DECKS[DECKS.length-1]){
    LEARNING_LIST.splice(i+1,0,'Xc','Xnc');
    LEARNING_WIN_LIST.splice(i+1,0,tmp1[counter],tmp2[counter]);
    LEARNING_OUT_LIST.splice(i+1,0,1,1);
    counter +=1; 
  }
}

// generate balanced pairs
var CHOICE_LISTS = [];
for (let r = 0; r < NUM_CHOICE_REPS; r++) {
  for(let i = 0; i < DECKS.length; i++) {
    for(let j = 0; j < DECKS.length; j++) {
      if(i >= j) continue; // avoid repeats
      CHOICE_LISTS.push([DECKS[i], DECKS[j]]);
    }
  }
};
  
// add one catch per deck
for (let r = 0; r < NUM_CATCH_REPS; r++) {
  for(let i = 0; i < DECKS.length; i++) {
    CHOICE_LISTS.push([DECKS[i], 'Xc'], [DECKS[i], 'Xnc']); 
  }
}; 

CHOICE_LISTS = _.shuffle(CHOICE_LISTS);
var WIN_LIST = _.shuffle(Array(CHOICE_LISTS.length/2).fill([0,1]).flat());


// make mock trial list
var MOCK_LIST = Array(NUM_MOCK_REPS).fill(DECKS).flat(); 

function ChoiceHTML(choices, keys=DECK_KEYS, hide=null, cue_size=CARD_SIZE, scale=300) {
  /**
 * Generates HTML for choice trials, which are two decks side-by-side with a key to press beneath. 
 * @param  {[Array]}    choices    The effort levels to display (length must be 2)
 * @param  {[Array]}    keys       The keys to display (defaults to DECK_KEYS in constants.js)
 * @param  {[Integer]}  hide       Index of key to be hidden for no-choice trials
 * @param  {[Array]}    cue_size   Size of the pie charts (defaults to CARD_SIZE from constants.js)
 * @param  {[Integer]}  font_size  The size of the point text (defaults to FONTSIZE in constants.js)
 * @param  {[Integer]}  scale      Scaling factor between cues (defaults to 2*CUESIZE[0])
 * 
 * @return {[Array||String]}       HTML elements for each component
 */

  if(choices.length != keys.length) {
    throw('choices and points must be equal size!')
  }

  if(choices.length > 2) {
    throw ('provide only two choices.');
  }

  choice1 = `<img src="static/images/cards/${choices[0]}.svg" width="${cue_size[0]}px" height="${cue_size[1]}px"></img>`;
  choice2 = `<img src="static/images/cards/${choices[1]}.svg" width="${cue_size[0]}px" height="${cue_size[1]}px"></img>`;
  key1    = `<img src="static/images/keys/${keys[0]}.svg" width="35%" height="75%"></img>`;
  key2    = `<img src="static/images/keys/${keys[1]}.svg" width="35%" height="75%"></img>`;

  if (hide==0) key1 = ''; 
  if (hide==1) key2 = ''; 


  html = `
  <table>
  <tr height=${scale}>
    <td width=${scale} height=${scale}>${choice1}</td>
    <td width=${scale} height=${scale}>${choice2}</td>
  </tr>
  <tr height=${scale-100}>
    <td width=${scale}>${key1}</td>
    <td width=${scale}>${key2}</td>
  </tr>
</table>
  `;

  return html; 

};



