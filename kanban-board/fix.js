const fs = require('fs');
const content = fs.readFileSync('src/TaskCard.tsx', 'utf8');

const bad = \                    </div>
              <div className="flex items-center text-xs text-slate-400\;

const good = \                    </div>
                  </div>
                );
              })}
            </div>

            {task.comments > 0 && (
              <div className="flex items-center text-xs text-slate-400\;

fs.writeFileSync('src/TaskCard.tsx', content.replace(bad, good));
