import {MarkdownParser} from './MarkdownParser';

// Adapted from the CommonMark 0.31.2 spec: https://spec.commonmark.org/0.31.2/#emphasis-and-strong-emphasis
const testCases = [
  ['Rule 1', [
    {
      input:  '*foo bar*',
      output: '<p><em>foo bar</em></p>',
    }, {
      input:  'a * foo bar*',
      output: '<p>a * foo bar*</p>',
    }, {
      input:  'a*"foo"*',
      output: '<p>a*"foo"*</p>',
      // modified: react should handle escaping quotes if necessary
    }, {
      input:  '* a *',
      output: '<p>* a *</p>',
    }, {
      input:  '*$*alpha.\n\n*£*bravo.\n\n*€*charlie.',
      output: '<p>*$*alpha.</p><p>*£*bravo.</p><p>*€*charlie.</p>',
    }, {
      input:  'foo*bar*',
      output: '<p>foo<em>bar</em></p>',
    }, {
      input:  '5*6*78',
      output: '<p>5<em>6</em>78</p>',
    },
  ]], ['Rule 2', [
    {
      input:  '_foo bar_',
      output: '<p><em>foo bar</em></p>',
    }, {
      input:  '_ foo bar_',
      output: '<p>_ foo bar_</p>',
    }, {
      input:  'a_"foo"_',
      output: '<p>a_"foo"_</p>',
      // modified: react should handle escaping quotes if necessary
    }, {
      input:  'foo_bar_',
      output: '<p>foo_bar_</p>',
    }, {
      input:  '5_6_78',
      output: '<p>5_6_78</p>',
    }, {
      input:  'пристаням_стремятся_',
      output: '<p>пристаням_стремятся_</p>',
    }, {
      input:  'aa_"bb"_cc',
      output: '<p>aa_"bb"_cc</p>',
      // modified: react should handle escaping quotes if necessary
    }, {
      input:  'foo-_(bar)_',
      output: '<p>foo-<em>(bar)</em></p>',
    },
  ]], ['Rule 3', [
    {
      input:  '_foo*',
      output: '<p>_foo*</p>',
    }, {
      input:  '*foo bar *',
      output: '<p>*foo bar *</p>',
    }, {
      input:  '*foo bar\n*',
      output: '<p>*foo bar<br>*</p>',
    }, {
      input:  '*(*foo)',
      output: '<p>*(*foo)</p>',
    }, {
      input:  '*(*foo*)*',
      output: '<p><em>(<em>foo</em>)</em></p>',
    }, {
      input:  '*foo*bar',
      output: '<p><em>foo</em>bar</p>',
    },
  ]], ['Rule 4', [
    {
      input:  '_foo bar _',
      output: '<p>_foo bar _</p>',
    }, {
      input:  '_(_foo)',
      output: '<p>_(_foo)</p>',
    }, {
      input:  '_(_foo_)_',
      output: '<p><em>(<em>foo</em>)</em></p>',
    }, {
      input:  '_foo_bar',
      output: '<p>_foo_bar</p>',
    }, {
      input:  '_пристаням_стремятся',
      output: '<p>_пристаням_стремятся</p>',
    }, {
      input:  '_foo_bar_baz_',
      output: '<p><em>foo_bar_baz</em></p>',
    }, {
      input:  '_(bar)_.',
      output: '<p><em>(bar)</em>.</p>',
    },
  ]], ['Rule 5', [
    {
      input:  '**foo bar**',
      output: '<p><strong>foo bar</strong></p>',
    }, {
      input:  '** foo bar**',
      output: '<p>** foo bar**</p>',
    }, {
      input:  'a**"foo"**',
      output: '<p>a**"foo"**</p>',
      // modified: react should handle escaping quotes if necessary
    }, {
      input:  'foo**bar**',
      output: '<p>foo<strong>bar</strong></p>',
    },
  ]], ['Rule 6', [
    {
      input:  '__foo bar__',
      output: '<p><strong>foo bar</strong></p>',
    }, {
      input:  '__ foo bar__',
      output: '<p>__ foo bar__</p>',
    }, {
      input:  '__\nfoo bar__',
      output: '<p>__<br>foo bar__</p>',
    }, {
      input:  'a__"foo"__',
      output: '<p>a__"foo"__</p>',
      // modified: react should handle escaping quotes if necessary
    }, {
      input:  'foo__bar__',
      output: '<p>foo__bar__</p>',
    }, {
      input:  '5__6__78',
      output: '<p>5__6__78</p>',
    }, {
      input:  'пристаням__стремятся__',
      output: '<p>пристаням__стремятся__</p>',
    }, {
      input:  '__foo, __bar__, baz__',
      output: '<p><strong>foo, <strong>bar</strong>, baz</strong></p>',
    }, {
      input:  'foo-__(bar)__',
      output: '<p>foo-<strong>(bar)</strong></p>',
    },
  ]], ['Rule 7', [
    {
      input:  '**foo bar **',
      output: '<p>**foo bar **</p>',
    }, {
      input:  '**(**foo)',
      output: '<p>**(**foo)</p>',
    }, {
      input:  '*(**foo**)*',
      output: '<p><em>(<strong>foo</strong>)</em></p>',
    }, {
      input:  '**Gomphocarpus (*Gomphocarpus physocarpus*, syn.\n*Asclepias physocarpa*)**',
      output: '<p><strong>Gomphocarpus (<em>Gomphocarpus physocarpus</em>, syn.<br><em>Asclepias physocarpa</em>)</strong></p>',
    }, {
      input:  '**foo "*bar*" foo**',
      output: '<p><strong>foo "<em>bar</em>" foo</strong></p>',
      // modified: react should handle escaping quotes if necessary
    }, {
      input:  '**foo**bar',
      output: '<p><strong>foo</strong>bar</p>',
    },
  ]], ['Rule 8', [
    {
      input:  '__foo bar __',
      output: '<p>__foo bar __</p>',
    }, {
      input:  '__(__foo)',
      output: '<p>__(__foo)</p>',
    }, {
      input:  '_(__foo__)_',
      output: '<p><em>(<strong>foo</strong>)</em></p>',
    }, {
      input:  '__foo__bar',
      output: '<p>__foo__bar</p>',
    }, {
      input:  '__пристаням__стремятся',
      output: '<p>__пристаням__стремятся</p>',
    }, {
      input:  '__foo__bar__baz__',
      output: '<p><strong>foo__bar__baz</strong></p>',
    }, {
      input:  '__(bar)__.',
      output: '<p><strong>(bar)</strong>.</p>',
    },
  ]], ['Rule 9', [
    {
      skip:   true,
      input:  '*foo [bar](/url)*',
      output: '<p><em>foo <a href="/url">bar</a></em></p>',
    }, {
      input:  '*foo\nbar*',
      output: '<p><em>foo<br>bar</em></p>',
    }, {
      input:  '_foo __bar__ baz_',
      output: '<p><em>foo <strong>bar</strong> baz</em></p>',
    }, {
      input:  '_foo _bar_ baz_',
      output: '<p><em>foo <em>bar</em> baz</em></p>',
    }, {
      input:  '__foo_ bar_',
      output: '<p><em><em>foo</em> bar</em></p>',
    }, {
      input:  '*foo *bar**',
      output: '<p><em>foo <em>bar</em></em></p>',
    }, {
      input:  '*foo **bar** baz*',
      output: '<p><em>foo <strong>bar</strong> baz</em></p>',
    }, {
      input:  '*foo**bar**baz*',
      output: '<p><em>foo<strong>bar</strong>baz</em></p>',
    }, {
      input:  '*foo**bar*',
      output: '<p><em>foo**bar</em></p>',
    }, {
      input:  '***foo** bar*',
      output: '<p><em><strong>foo</strong> bar</em></p>',
    }, {
      input:  '*foo **bar***',
      output: '<p><em>foo <strong>bar</strong></em></p>',
    }, {
      input:  '*foo**bar***',
      output: '<p><em>foo<strong>bar</strong></em></p>',
    }, {
      input:  'foo***bar***baz',
      output: '<p>foo<em><strong>bar</strong></em>baz</p>',
    }, {
      input:  'foo******bar*********baz',
      output: '<p>foo<strong><strong><strong>bar</strong></strong></strong>***baz</p>',
    }, {
      input:  '*foo **bar *baz* bim** bop*',
      output: '<p><em>foo <strong>bar <em>baz</em> bim</strong> bop</em></p>',
    }, {
      skip:   true,
      input:  '*foo [*bar*](/url)*',
      output: '<p><em>foo <a href="/url"><em>bar</em></a></em></p>',
    }, {
      input:  '** is not an empty emphasis',
      output: '<p>** is not an empty emphasis</p>',
    }, {
      input:  '**** is not an empty strong emphasis',
      output: '<p>**** is not an empty strong emphasis</p>',
    },
  ]], ['Rule 10', [
    {
      skip:   true,
      input:  '**foo [bar](/url)**',
      output: '<p><strong>foo <a href="/url">bar</a></strong></p>',
    }, {
      input:  '**foo\nbar**',
      output: '<p><strong>foo<br>bar</strong></p>',
    }, {
      input:  '__foo _bar_ baz__',
      output: '<p><strong>foo <em>bar</em> baz</strong></p>',
    }, {
      input:  '__foo __bar__ baz__',
      output: '<p><strong>foo <strong>bar</strong> baz</strong></p>',
    }, {
      input:  '____foo__ bar__',
      output: '<p><strong><strong>foo</strong> bar</strong></p>',
    }, {
      input:  '**foo **bar****',
      output: '<p><strong>foo <strong>bar</strong></strong></p>',
    }, {
      input:  '**foo *bar* baz**',
      output: '<p><strong>foo <em>bar</em> baz</strong></p>',
    }, {
      input:  '**foo*bar*baz**',
      output: '<p><strong>foo<em>bar</em>baz</strong></p>',
    }, {
      input:  '***foo* bar**',
      output: '<p><strong><em>foo</em> bar</strong></p>',
    }, {
      input:  '**foo *bar***',
      output: '<p><strong>foo <em>bar</em></strong></p>',
    }, {
      input:  '**foo *bar **baz**\nbim* bop**',
      output: '<p><strong>foo <em>bar <strong>baz</strong><br>bim</em> bop</strong></p>',
    }, {
      skip:   true,
      input:  '**foo [*bar*](/url)**',
      output: '<p><strong>foo <a href="/url"><em>bar</em></a></strong></p>',
    }, {
      input:  '__ is not an empty emphasis',
      output: '<p>__ is not an empty emphasis</p>',
    }, {
      input:  '____ is not an empty strong emphasis',
      output: '<p>____ is not an empty strong emphasis</p>',
    },
  ]], ['Rule 11', [
    {
      input:  'foo ***',
      output: '<p>foo ***</p>',
    }, {
      input:  'foo *\\**',
      output: '<p>foo <em>*</em></p>',
    }, {
      input:  'foo *_*',
      output: '<p>foo <em>_</em></p>',
    }, {
      input:  'foo *****',
      output: '<p>foo *****</p>',
    }, {
      input:  'foo **\\***',
      output: '<p>foo <strong>*</strong></p>',
    }, {
      input:  'foo **_**',
      output: '<p>foo <strong>_</strong></p>',
    }, {
      input:  '**foo*',
      output: '<p>*<em>foo</em></p>',
    }, {
      input:  '*foo**',
      output: '<p><em>foo</em>*</p>',
    }, {
      input:  '***foo**',
      output: '<p>*<strong>foo</strong></p>',
    }, {
      input:  '****foo*',
      output: '<p>***<em>foo</em></p>',
    }, {
      input:  '**foo***',
      output: '<p><strong>foo</strong>*</p>',
    }, {
      input:  '*foo****',
      output: '<p><em>foo</em>***</p>',
    },
  ]], ['Rule 12', [
    {
      input:  'foo ___',
      output: '<p>foo ___</p>',
    }, {
      input:  'foo _\\__',
      output: '<p>foo <em>_</em></p>',
    }, {
      input:  'foo _*_',
      output: '<p>foo <em>*</em></p>',
    }, {
      input:  'foo _____',
      output: '<p>foo _____</p>',
    }, {
      input:  'foo __\\___',
      output: '<p>foo <strong>_</strong></p>',
    }, {
      input:  'foo __*__',
      output: '<p>foo <strong>*</strong></p>',
    }, {
      input:  '__foo_',
      output: '<p>_<em>foo</em></p>',
    }, {
      input:  '_foo__',
      output: '<p><em>foo</em>_</p>',
    }, {
      input:  '___foo__',
      output: '<p>_<strong>foo</strong></p>',
    }, {
      input:  '____foo_',
      output: '<p>___<em>foo</em></p>',
    }, {
      input:  '__foo___',
      output: '<p><strong>foo</strong>_</p>',
    }, {
      input:  '_foo____',
      output: '<p><em>foo</em>___</p>',
    },
  ]], ['Rule 13', [
    {
      input:  '**foo**',
      output: '<p><strong>foo</strong></p>',
    }, {
      input:  '*_foo_*',
      output: '<p><em><em>foo</em></em></p>',
    }, {
      input:  '__foo__',
      output: '<p><strong>foo</strong></p>',
    }, {
      input:  '_*foo*_',
      output: '<p><em><em>foo</em></em></p>',
    }, {
      input:  '****foo****',
      output: '<p><strong><strong>foo</strong></strong></p>',
    }, {
      input:  '____foo____',
      output: '<p><strong><strong>foo</strong></strong></p>',
    }, {
      input:  '******foo******',
      output: '<p><strong><strong><strong>foo</strong></strong></strong></p>',
    },
  ]], ['Rule 14', [
    {
      input:  '***foo***',
      output: '<p><em><strong>foo</strong></em></p>',
    }, {
      input:  '_____foo_____',
      output: '<p><em><strong><strong>foo</strong></strong></em></p>',
    },
  ]], ['Rule 15', [
    {
      input:  '*foo _bar* baz_',
      output: '<p><em>foo _bar</em> baz_</p>',
    }, {
      input:  '*foo __bar *baz bim__ bam*',
      output: '<p><em>foo <strong>bar *baz bim</strong> bam</em></p>',
    },
  ]], ['Rule 16', [
    {
      input:  '**foo **bar baz**',
      output: '<p>**foo <strong>bar baz</strong></p>',
    }, {
      input:  '*foo *bar baz*',
      output: '<p>*foo <em>bar baz</em></p>',
    },
  ]], ['Rule 17', [
    {
      skip:   true,
      input:  '*[bar*](/url)',
      output: '<p>*<a href="/url">bar*</a></p>',
    }, {
      skip:   true,
      input:  '_foo [bar_](/url)',
      output: '<p>_foo <a href="/url">bar_</a></p>',
    }, {
      skip:   true,
      input:  '*<img src="foo" title="*"/>',
      output: '<p>*<img src="foo" title="*"/></p>',
    }, {
      skip:   true,
      input:  '**<a href="**">',
      output: '<p>**<a href="**"></p>',
    }, {
      skip:   true,
      input:  '__<a href="__">',
      output: '<p>__<a href="__"></p>',
    }, {
      skip:   true,
      input:  '*a `*`*',
      output: '<p><em>a <code>*</code></em></p>',
    }, {
      skip:   true,
      input:  '_a `_`_',
      output: '<p><em>a <code>_</code></em></p>',
    }, {
      skip:   true,
      input:  '**a<https://foo.bar/?q=**>',
      output: '<p>**a<a href="https://foo.bar/?q=**">https://foo.bar/?q=**</a></p>',
    }, {
      skip:   true,
      input:  '__a<https://foo.bar/?q=__>',
      output: '<p>__a<a href="https://foo.bar/?q=__">https://foo.bar/?q=__</a></p>',
    },
  ]], ['newline bug', [
    {
      input:  'words, **bold \\n\\n words** more \\a\\b\\c\\d\\e words.',
      output: '<p>words, <strong>bold \\n\\n words</strong> more \\a\\b\\c\\d\\e words.</p>',
    },
  ]],
];

const stringifyTree = (node) => {
  if (Array.isArray(node)) {
    return node.map(stringifyTree).join('');
  }
  if (node.type === 'document') {
    return stringifyTree(node.data);
  } else if (node.type === 'paragraph') {
    return `<p>${stringifyTree(node.data)}</p>`;
  } else if (node.type === 'linebreak') {
    return '<br>';
  } else if (node.type === 'em') {
    return `<em>${stringifyTree(node.data)}</em>`;
  } else if (node.type === 'strong') {
    return `<strong>${stringifyTree(node.data)}</strong>`;
  } else if (node.type === 'text') {
    return node.data;
  }
  throw new Error('unhandled node type', node);
};

describe.each(testCases)('CommonMark spec - inline strong and emphasis', (name, cases) => {
  describe.each(cases.map((x, i) => [x, i]))(name, ({skip, input, output}, index) => {
    const testName = `Case ${index}`;
    const testFn = () => {
      const tree = MarkdownParser(input);
      const result = stringifyTree(tree);
      expect(result).toBe(output);
    };

    if (skip) {
      test.skip(testName, testFn);
    } else {
      test(testName, testFn);
    }
  });
});
