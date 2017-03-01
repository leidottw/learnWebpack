import './style/app.scss';
import moment from 'moment';

setTimeout(function init() {
    document.querySelector('body').className = 'blue';
    document.querySelector('body').innerHTML =
`<pre>A problem has been detected and windows has been shotdown to prevent damage to your computer.

IRQL_NOT_LESS_OR_EQUAL

If this is the first time you've seen this stop error screen, restart your computer. If this screen appers again, follow these steps:

Check to make sure any new hardware or software is properly installed.
If this is a new installation, ask your hardware or software manufacurer for any windows updates you might need.

If problems contine, disable or remove any newly installed hardware or software. Disable BIOS memory options such as caching or shadowing.
If yout need to use safe mode to remove or disable components restart your compute, press F8 to select Advanced Starup Options, and then select Safe Mode.

Technical information:

*** STOP: 0x0000000A (0x00000000, 0x00000002, 0x00000000, 0x807C857A)

${moment().format()}</pre>`
}, 500);
