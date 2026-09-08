from pathlib import Path
Path('.qa/results').mkdir(exist_ok=True)
from pathlib import Path
import re,json
exts={'.js','.jsx','.ts','.tsx','.css','.scss','.mjs','.cjs'}
roots=[Path('pages'),Path('src')]
files=[p for root in roots if root.exists() for p in root.rglob('*') if p.is_file() and p.suffix in exts]
text={p.as_posix():p.read_text(encoding='utf-8',errors='ignore') for p in files}
page_files=[p for p in files if p.as_posix().startswith('pages/') and p.suffix in {'.js','.jsx','.ts','.tsx'} and not p.name.startswith('_') and '/api/' not in p.as_posix()]
static_routes=[]; dynamic_routes=[]
for p in page_files:
  rel=p.relative_to('pages').with_suffix('')
  parts=list(rel.parts)
  if parts[-1]=='index': parts=parts[:-1]
  route='/'+'/'.join(parts); route=route if route!='/' else '/'
  (dynamic_routes if any('[' in x or ']' in x for x in parts) else static_routes).append(route)
def n(rx): return sum(len(re.findall(rx,s,re.I|re.M)) for s in text.values())
inv={
  'source_files':len(files),'page_files':len(page_files),'static_routes':len(set(static_routes)),'dynamic_routes':len(set(dynamic_routes)),
  'components':sum(1 for p in files if '/components/' in p.as_posix().replace('\\','/')),
  'forms':n(r'<(?:form|Formik|TextField|Select|Checkbox|Radio)\b'),'buttons_links':n(r'<(?:Button|IconButton|button|a|Link)\b'),
  'dialogs_drawers':n(r'<(?:Dialog|Modal|Drawer|BottomSheet|Popover|Menu)\b'),'loaders_skeletons':n(r'\b(?:Skeleton|CircularProgress|LinearProgress|loading|spinner|Lottie)\b'),
  'animations_transitions':n(r'\b(?:transition|animation|Fade|Slide|Collapse|Grow|Zoom|CSSTransition|TransitionGroup)\b'),
  'console_calls':n(r'console\.(?:log|warn|error|debug)\s*\('),'important_rules':n(r'!important'),'zindex_rules':n(r'zIndex\s*:|z-index\s*:'),
  'absolute_fixed_sticky':n(r'position\s*:\s*["\']?(?:absolute|fixed|sticky)|position\s*:\s*(?:absolute|fixed|sticky)'),
  'hardcoded_font_px':n(r'fontSize\s*:\s*["\']?\d+(?:\.\d+)?px|font-size\s*:\s*\d+(?:\.\d+)?px'),
  'hardcoded_dimensions_px':n(r'\b(?:width|height|minWidth|maxWidth|minHeight|maxHeight)\s*:\s*["\']?\d{2,}(?:\.\d+)?px'),
  'text_transform':n(r'textTransform\s*:|text-transform\s*:'),'overflow_rules':n(r'overflow(?:X|Y)?\s*:|overflow(?:-x|-y)?\s*:'),
  'mui_media_queries':n(r'useMediaQuery\s*\(|breakpoints\.(?:up|down|between|only)\s*\('),'aria_attributes':n(r'aria-[a-z-]+\s*='),'alt_attributes':n(r'\balt\s*=')}
risks=[]
checks=[('console',r'console\.(?:log|warn|error|debug)\s*\(',2),('important',r'!important',2),('zindex',r'zIndex\s*:\s*(?:[1-9]\d{2,})|z-index\s*:\s*(?:[1-9]\d{2,})',2),('absolute_fixed',r'position\s*:\s*["\']?(?:absolute|fixed)',1),('large_font',r'fontSize\s*:\s*["\']?(?:[3-9]\d|\d{3,})px',2),('fixed_dimension',r'\b(?:width|height)\s*:\s*["\']?(?:[5-9]\d\d|\d{4,})px',2)]
for p,s in text.items():
  score=0; sig=[]
  for tag,rx,w in checks:
    c=len(re.findall(rx,s,re.I))
    if c: score+=min(c,5)*w; sig.append(f'{tag}:{c}')
  if score>=4: risks.append({'file':p,'score':score,'signals':sig})
risks.sort(key=lambda x:(-x['score'],x['file']))
report={'inventory':inv,'static_routes':sorted(set(static_routes)),'dynamic_routes':sorted(set(dynamic_routes)),'files':sorted(text),'high_risk_files':risks}
Path('.qa/results/inventory.json').write_text(json.dumps(report,indent=2),encoding='utf-8')
print(json.dumps(inv,indent=2))