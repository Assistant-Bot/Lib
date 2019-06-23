/* Modules */
exports.pager = require('./modules/pager/pager');
exports.counter = require('./utils/Classes/LineCounter');
exports.Permission = require('./modules/Permission');
exports.Wrapper = require('./utils/Classes/Wrapper');
exports.ErrorMsg = require('./utils/Classes/ErrorMsg');
exports.CommandHandler = require('./utils/CommandHandler/main');
exports.CommandHandlerOptions = require('./utils/CommandHandler/Classes/Options');
exports.AdvancedMap = require('./utils/Classes/AdvancedMap');
exports.SimpleEmbed = require('./utils/Classes/SimpleEmbed');
/* Functions */
exports.ObjectFilter = require('./utils/functions/objectFilter');
exports.findMember = require('./utils/functions/findMember');
exports.resolveMember = require('./utils/functions/findMember');
exports.getColor = require('./utils/functions/color');
exports.resolveColor = require('./utils/functions/resolveColor');
exports.fieldContent = require('./utils/functions/fieldContent');
exports.loadProperties = require('./utils/functions/loadProperties');
exports.sendError = require('./utils/functions/errorMsg');
exports.sendErr = this.sendError;
exports.logError = require('./utils/functions/logError');
exports.LogError = this.logError;
exports.database = require('./Database/Main');
exports.runCommand = require('./utils/functions/runCommand');