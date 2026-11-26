#!/usr/bin/env python3
"""Build a review edition from an exact public source snapshot. No approval implied."""
import argparse, hashlib, html, json, pathlib, re, zipfile
from xml.etree import ElementTree as ET
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak, KeepTogether
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.colors import HexColor
from reportlab.lib.enums import TA_CENTER
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
ROOT=pathlib.Path(__file__).resolve().parents[1]
EDITION=ROOT/'editions/letters-to-the-seeker'
def digest(data): return hashlib.sha256(data).hexdigest()
def inline(text):
    text=html.escape(text)
    text=re.sub(r'\*\*(.+?)\*\*',r'<strong>\1</strong>',text)
    return re.sub(r'\*(.+?)\*',r'<em>\1</em>',text)
def blocks(text):
    result=[]
    for block in re.split(r'\n\s*\n',text.replace('\r\n','\n')):
        block=block.strip()
        if not block or block=='---': continue
        if block.startswith('# '): result.append(('h1',block[2:]))
        elif block.startswith('## '): result.append(('h2',block[3:]))
        else: result.append(('p',re.sub(r'^>\s*','',block,flags=re.M).replace('\n',' ')))
    return result

def build(source=None):
    EDITION.mkdir(parents=True,exist_ok=True)
    if source:
        # Preserve exact bytes, including line endings. Never rewrite the canonical source.
        (EDITION/'source.md').write_bytes(pathlib.Path(source).read_bytes())
    raw=(EDITION/'source.md').read_bytes(); text=raw.decode('utf-8'); content=blocks(text)
    revision='afc2f17d46bd2659e296edc8b4a2dc4acc0b5cfe'
    metadata={
      'schema_version':'arcanea.edition.v1','edition_id':'letters-to-the-seeker-digital-rc1',
      'title':'Letters to the Seeker','subtitle':'Nine letters from the world of Arcanea',
      'imprint':'Arcanea Publishing House','language':'en','word_count':len(text.split()),
      'creator_attribution':'Arcanea; contributor credits require confirmation',
      'rights_owner_claimed':'Frank Riemer','rights_evidence':f'https://github.com/Arcanea-Labs/Arcanea/blob/{revision}/LICENSING.md',
      'rights_state':'edition_attestation_pending','historical_license_review':'required: canonical repository reports prior CC0 exposure',
      'editorial_state':'review_required','canon_state':'existing_source_snapshot_not_new_canon',
      'price_cents':900,'currency':'EUR','price_state':'proposal_for_test_only',
      'release_state':'PREVIEW','supply_cap':None,'license':'Personal reading license proposed; no IP transfer; approval pending',
      'source':{'repository':'Arcanea-Labs/Arcanea','revision':revision,'path':'book/wisdom-scrolls/IV_LETTERS_TO_THE_SEEKER.md','sha256':digest(raw)},
      'art':{'type':'typographic_cover_concept','illustrations':[],'design_source':'Arcanea-Labs/arcanea-ai-app@5dab6d11f33e99085af18e0325aff216cd670d08:packages/design-system/src/tokens.css'},
      'accessibility':{'epub':'Semantic XHTML, navigation, language and reading order; EPUBCheck and reader testing required','pdf':'Selectable text, bookmarks and language; PDF/UA not certified'},
      'approvals':[],'artifacts':{}
    }
    front='<h1>Letters to the Seeker</h1><p>Nine letters from the world of Arcanea</p><p>Arcanea Publishing House</p><p>Review edition · Not for public sale</p><p>Fictional correspondence. Statements belong to the characters and are not factual or clinical guidance. Source text is preserved. Editorial review, contributor attribution and edition rights approval are pending.</p><p>Rights holder recorded in the canonical repository: Frank Riemer. Prior licensing exposure requires review. This preview does not assert exclusivity.</p>'
    chapters=[]; current=[]; title='Opening'
    for tag,value in content:
        if tag=='h1' and current:
            chapters.append((title,current));current=[]
        if tag=='h1':title=value
        current.append(f'<{tag}>{inline(value)}</{tag}>')
    if current:chapters.append((title,current))
    def xhtml(title,body):return '<?xml version="1.0" encoding="UTF-8"?>'+'<!DOCTYPE html><html xmlns="http://www.w3.org/1999/xhtml" lang="en" xml:lang="en"><head><title>'+html.escape(title)+'</title><link rel="stylesheet" type="text/css" href="style.css"/></head><body>'+body+'</body></html>'
    epub=EDITION/'letters-to-the-seeker.epub'
    with zipfile.ZipFile(epub,'w') as z:
        def add(name,value,compress=zipfile.ZIP_DEFLATED):
            info=zipfile.ZipInfo(name,(2026,11,13,0,0,0));info.compress_type=compress;z.writestr(info,value)
        add('mimetype','application/epub+zip',zipfile.ZIP_STORED)
        add('META-INF/container.xml','<?xml version="1.0"?><container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container"><rootfiles><rootfile full-path="EPUB/package.opf" media-type="application/oebps-package+xml"/></rootfiles></container>')
        add('EPUB/title.xhtml',xhtml(metadata['title'],front))
        add('EPUB/style.css','body{font-family:serif;line-height:1.6;margin:5%;color:#29231e}h1{font-size:1.7em;line-height:1.25}h2{font-size:1.2em}p{orphans:3;widows:3}a{color:#145860}')
        items=['<item id="title" href="title.xhtml" media-type="application/xhtml+xml"/>','<item id="css" href="style.css" media-type="text/css"/>','<item id="nav" href="nav.xhtml" properties="nav" media-type="application/xhtml+xml"/>'];spine=['<itemref idref="title"/>'];nav=[]
        for i,(title,parts) in enumerate(chapters):
            name=f'chapter-{i}.xhtml';add('EPUB/'+name,xhtml(title,''.join(parts)))
            items.append(f'<item id="ch{i}" href="{name}" media-type="application/xhtml+xml"/>');spine.append(f'<itemref idref="ch{i}"/>');nav.append(f'<li><a href="{name}">{html.escape(title)}</a></li>')
        add('EPUB/nav.xhtml','<?xml version="1.0"?><html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" lang="en" xml:lang="en"><head><title>Contents</title></head><body><nav epub:type="toc" id="toc"><h1>Contents</h1><ol>'+''.join(nav)+'</ol></nav></body></html>')
        add('EPUB/package.opf','<?xml version="1.0"?><package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="book-id"><metadata xmlns:dc="http://purl.org/dc/elements/1.1/"><dc:identifier id="book-id">urn:arcanea:'+metadata['edition_id']+'</dc:identifier><dc:title>'+metadata['title']+'</dc:title><dc:language>en</dc:language><dc:publisher>Arcanea Publishing House</dc:publisher><dc:rights>Review edition. Edition rights approval pending.</dc:rights><meta property="dcterms:modified">2026-11-13T00:00:00Z</meta></metadata><manifest>'+''.join(items)+'</manifest><spine>'+''.join(spine)+'</spine></package>')
    styles=getSampleStyleSheet();styles.add(ParagraphStyle(name='BookBody',fontName='Times-Roman',fontSize=11,leading=17,spaceAfter=10,textColor=HexColor('#29231e')));styles.add(ParagraphStyle(name='BookTitle',fontName='Times-Roman',fontSize=33,leading=38,spaceAfter=24,textColor=HexColor('#153432')))
    flow=[Spacer(1,110),Paragraph(metadata['title'],styles['BookTitle']),Paragraph(metadata['subtitle'],styles['BookBody']),Spacer(1,50)]
    # Use the same review notice as the EPUB.
    for tag,value in blocks(re.sub('<[^>]+>','\n',front)):
        if value not in (metadata['title'],metadata['subtitle']):flow.append(Paragraph(inline(value).replace('<strong>','<b>').replace('</strong>','</b>').replace('<em>','<i>').replace('</em>','</i>'),styles['BookBody']))
    flow.append(PageBreak())
    for tag,value in content:
        if tag=='h1':
            if flow and not isinstance(flow[-1],PageBreak):flow.append(PageBreak())
            flow.append(Paragraph(inline(value),styles['Heading1']))
        else:flow.append(Paragraph(inline(value).replace('<strong>','<b>').replace('</strong>','</b>').replace('<em>','<i>').replace('</em>','</i>'),styles['Heading2'] if tag=='h2' else styles['BookBody']))
    class BookDoc(SimpleDocTemplate):
        def afterFlowable(self,f):
            if isinstance(f,Paragraph) and f.style.name=='Heading1':
                title=f.getPlainText();key=digest(title.encode())[:12];self.canv.bookmarkPage(key);self.canv.addOutlineEntry(title,key,0)
    def page(canvas,doc):
        canvas.setTitle(metadata['title']);canvas.setAuthor('Arcanea Publishing House — attribution under review');canvas.setSubject('Review edition; not released');canvas._doc.Catalog.Lang='en';canvas.setFont('Times-Roman',9);canvas.setFillColor(HexColor('#695f55'));canvas.drawString(52,28,'ARCANEA / REVIEW EDITION');canvas.drawRightString(368,28,str(doc.page))
    pdf=EDITION/'letters-to-the-seeker.pdf'
    BookDoc(str(pdf),pagesize=(420,595),rightMargin=52,leftMargin=52,topMargin=48,bottomMargin=48,invariant=1).build(flow,onFirstPage=page,onLaterPages=page)
    for fmt,path in [('epub',epub),('pdf',pdf)]:
        data=path.read_bytes();metadata['artifacts'][fmt]={'key':metadata['edition_id']+'/'+digest(data)+'/'+path.name,'sha256':digest(data),'bytes':len(data)}
    metadata['manifest_sha256']=digest(json.dumps(metadata,sort_keys=True,separators=(',',':')).encode())
    (EDITION/'edition.json').write_text(json.dumps(metadata,indent=2)+'\n')
    evidence={'source_unchanged':digest(raw)==metadata['source']['sha256'],'word_count':len(text.split()),'letters':len(re.findall(r'^# Letter [IVX]+:',text,re.M)),'epub_xml_valid':True,'pdf_header_valid':pdf.read_bytes().startswith(b'%PDF-'),'pdf_ua_certified':False,'epubcheck':'not_run','release_approved':False}
    with zipfile.ZipFile(epub) as z:
        assert z.namelist()[0]=='mimetype' and z.getinfo('mimetype').compress_type==zipfile.ZIP_STORED
        for name in z.namelist():
            if name.endswith(('.xml','.xhtml','.opf')):ET.fromstring(z.read(name))
    (ROOT/'evidence/edition-build.json').write_text(json.dumps(evidence,indent=2)+'\n')
    print(json.dumps(evidence))
if __name__=='__main__':
    p=argparse.ArgumentParser();p.add_argument('--source');args=p.parse_args();build(args.source)
