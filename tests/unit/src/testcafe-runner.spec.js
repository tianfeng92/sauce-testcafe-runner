jest.mock('testcafe');
jest.mock('sauce-testrunner-utils');
jest.mock('../../../src/sauce-testreporter');
const { buildCommandLine, buildCompilerOptions } = require('../../../src/testcafe-runner');


describe('.buildCommandLine', function () {
  it('most basic config', function () {
    const cli = buildCommandLine({
      browserName: 'firefox',
      src: ['**/*.test.js'],
    }, '/fake/project/path', '/fake/assets/path');
    expect(cli).toMatchObject([
      'firefox:headless:marionettePort=9223',
      '**/*.test.js',
      '--video', '/fake/assets/path',
      '--video-options', 'singleFile=true,failedOnly=false,pathPattern=video.mp4',
      '--reporter',
      'xunit:/fake/assets/path/report.xml,json:/fake/assets/path/report.json,sauce-json:/fake/assets/path/sauce-test-report.json,list',
    ]);
  });
  it('most basic config with typescript options', function () {
    const cli = buildCommandLine({
      browserName: 'firefox',
      src: ['**/*.test.js'],
      compilerOptions: {
        typescript: {
          customCompilerModulePath: '/compiler/path',
          configPath: 'tsconfig.json',
        },
      },
    }, '/fake/project/path', '/fake/assets/path');
    expect(cli).toMatchObject([
      'firefox:headless:marionettePort=9223',
      '**/*.test.js',
      '--compiler-options', 'typescript.configPath=\'tsconfig.json\',typescript.customCompilerModulePath=\'/compiler/path\'',
      '--video', '/fake/assets/path',
      '--video-options', 'singleFile=true,failedOnly=false,pathPattern=video.mp4',
      '--reporter',
      'xunit:/fake/assets/path/report.xml,json:/fake/assets/path/report.json,sauce-json:/fake/assets/path/sauce-test-report.json,list',
    ]);
  });
  it('basic with filters', function () {
    const cli = buildCommandLine({
      browserName: 'firefox',
      src: ['**/*.test.js'],
      filter: {
        test: 'fixed-test-name',
        testGrep: '.*test-name.*',
        fixture: 'fixed-fixture-name',
        fixtureGrep: '.*fixture-name.*',
        testMeta: {
          'my-key': 'my-val',
          '2nd-key': '2nd-val',
        },
        fixtureMeta: {
          'my-key': 'my-val',
          '2nd-key': '2nd-val',
        },
      }
    }, '/fake/project/path', '/fake/assets/path');
    expect(cli).toMatchObject([
      'firefox:headless:marionettePort=9223',
      '**/*.test.js',
      '--video', '/fake/assets/path',
      '--video-options', 'singleFile=true,failedOnly=false,pathPattern=video.mp4',
      '--test', 'fixed-test-name',
      '--fixture', 'fixed-fixture-name',
      '--test-grep', '.*test-name.*',
      '--fixture-grep', '.*fixture-name.*',
      '--test-meta', 'my-key=my-val,2nd-key=2nd-val',
      '--fixture-meta', 'my-key=my-val,2nd-key=2nd-val',
      '--reporter',
      'xunit:/fake/assets/path/report.xml,json:/fake/assets/path/report.json,sauce-json:/fake/assets/path/sauce-test-report.json,list',
    ]);
  });
  it('basic with screenshots', function () {
    const cli = buildCommandLine({
      browserName: 'firefox',
      src: ['**/*.test.js'],
      screenshots: {
        fullPage: true,
        takeOnFails: true,
      },
    }, '/fake/project/path', '/fake/assets/path');
    expect(cli).toMatchObject([
      'firefox:headless:marionettePort=9223',
      '**/*.test.js',
      '--video', '/fake/assets/path',
      '--video-options', 'singleFile=true,failedOnly=false,pathPattern=video.mp4',
      '--screenshots', 'takeOnFails=true,fullPage=true,path=/fake/assets/path,pathPattern=${FIXTURE}__${TEST}__screenshot-${FILE_INDEX}',
      '--reporter',
      'xunit:/fake/assets/path/report.xml,json:/fake/assets/path/report.json,sauce-json:/fake/assets/path/sauce-test-report.json,list',
    ]);
  });
  it('basic with quarantineMode', function () {
    const cli = buildCommandLine({
      browserName: 'firefox',
      src: ['**/*.test.js'],
      quarantineMode: {
        attemptLimit: 10,
        successThreshold: 3,
      },
    }, '/fake/project/path', '/fake/assets/path');
    expect(cli).toMatchObject([
      'firefox:headless:marionettePort=9223',
      '**/*.test.js',
      '--quarantine-mode', 'attemptLimit=10,successThreshold=3',
      '--video', '/fake/assets/path',
      '--video-options', 'singleFile=true,failedOnly=false,pathPattern=video.mp4',
      '--reporter',
      'xunit:/fake/assets/path/report.xml,json:/fake/assets/path/report.json,sauce-json:/fake/assets/path/sauce-test-report.json,list',
    ]);
  });
  it('basic with different flags', function () {
    const cli = buildCommandLine({
      browserName: 'firefox',
      src: ['**/*.test.js'],
      skipJsErrors: true,
      skipUncaughtErrors: true,
      selectorTimeout: 1000,
      assertionTimeout: 1000,
      pageLoadTimeout: 1000,
      speed: 0.5,
      stopOnFirstFail: true,
      disablePageCaching: true,
      disableScreenshots: true,
    }, '/fake/project/path', '/fake/assets/path');
    expect(cli).toMatchObject([
      'firefox:headless:marionettePort=9223',
      '**/*.test.js',
      '--skip-js-errors',
      '--skip-uncaught-errors',
      '--selector-timeout', 1000,
      '--assertion-timeout', 1000,
      '--page-load-timeout', 1000,
      '--speed', 0.5,
      '--stop-on-first-fail',
      '--disable-page-caching',
      '--disable-screenshots',
      '--video', '/fake/assets/path',
      '--video-options', 'singleFile=true,failedOnly=false,pathPattern=video.mp4',
      '--reporter',
      'xunit:/fake/assets/path/report.xml,json:/fake/assets/path/report.json,sauce-json:/fake/assets/path/sauce-test-report.json,list',
    ]);
  });
  it('basic with client scripts', function () {
    const cli = buildCommandLine({
      browserName: 'firefox',
      src: ['**/*.test.js'],
      clientScripts: [
        'script.js',
      ],
    }, '/fake/project/path', '/fake/assets/path');
    expect(cli).toMatchObject([
      'firefox:headless:marionettePort=9223',
      '**/*.test.js',
      '--client-scripts', '/fake/project/path/script.js',
      '--video', '/fake/assets/path',
      '--video-options', 'singleFile=true,failedOnly=false,pathPattern=video.mp4',
      '--reporter',
      'xunit:/fake/assets/path/report.xml,json:/fake/assets/path/report.json,sauce-json:/fake/assets/path/sauce-test-report.json,list',
    ]);
  });
  it('basic with tsConfigPath', function () {
    const cli = buildCommandLine({
      browserName: 'firefox',
      src: ['**/*.test.js'],
      tsConfigPath: 'tsconfig.json',
    }, '/fake/project/path', '/fake/assets/path');
    expect(cli).toMatchObject([
      'firefox:headless:marionettePort=9223',
      '**/*.test.js',
      '--ts-config-path', 'tsconfig.json',
      '--video', '/fake/assets/path',
      '--video-options', 'singleFile=true,failedOnly=false,pathPattern=video.mp4',
      '--reporter',
      'xunit:/fake/assets/path/report.xml,json:/fake/assets/path/report.json,sauce-json:/fake/assets/path/sauce-test-report.json,list',
    ]);
  });
  it('basic with no-array src', function () {
    const cli = buildCommandLine({
      browserName: 'firefox',
      src: '**/*.test.js',
    }, '/fake/project/path', '/fake/assets/path');
    expect(cli).toMatchObject([
      'firefox:headless:marionettePort=9223',
      '**/*.test.js',
      '--video', '/fake/assets/path',
      '--video-options', 'singleFile=true,failedOnly=false,pathPattern=video.mp4',
      '--reporter',
      'xunit:/fake/assets/path/report.xml,json:/fake/assets/path/report.json,sauce-json:/fake/assets/path/sauce-test-report.json,list',
    ]);
  });
  it('basic with browserArgs', function () {
    const cli = buildCommandLine({
      browserName: 'firefox',
      src: '**/*.test.js',
      browserArgs: ['--chrome-fake-param'],
    }, '/fake/project/path', '/fake/assets/path');
    expect(cli).toMatchObject([
      'firefox:headless:marionettePort=9223 --chrome-fake-param',
      '**/*.test.js',
      '--video', '/fake/assets/path',
      '--video-options', 'singleFile=true,failedOnly=false,pathPattern=video.mp4',
      '--reporter',
      'xunit:/fake/assets/path/report.xml,json:/fake/assets/path/report.json,sauce-json:/fake/assets/path/sauce-test-report.json,list',
    ]);
  });
  it('basic with invalid browser', function () {
    const t = () => {
      buildCommandLine({
        browserName: 'invalid',
        src: '**/*.test.js',
      }, '/fake/project/path', '/fake/assets/path');
    };
    expect(t).toThrow('Unsupported browser: invalid.');
  });
  describe('with env + inside VM', function () {
    const OLD_ENV = process.env;

    afterAll(function () {
      process.env = OLD_ENV;
    });

    it('should use http_proxy', function () {
      process.env.SAUCE_VM = 'truthy';
      process.env.SAUCE_VIDEO_RECORD = 'truthy';
      process.env.SAUCE_BROWSER_PATH = 'D:\\chrome99\\chrome.exe';
      process.env.HTTP_PROXY = 'http://localhost:8080';
      const cli = buildCommandLine({
        browserName: 'firefox',
        src: '**/*.test.js',
      }, '/fake/project/path', '/fake/assets/path');
      expect(cli).toMatchObject([
        'D:\\chrome99\\chrome.exe',
        '**/*.test.js',
        '--video', '/fake/assets/path',
        '--video-options', 'singleFile=true,failedOnly=false,pathPattern=video.mp4',
        '--proxy', 'localhost:8080',
        '--reporter',
        'xunit:/fake/assets/path/report.xml,json:/fake/assets/path/report.json,sauce-json:/fake/assets/path/sauce-test-report.json,list',
      ]);
    });
  });
});

describe('.buildCompilerOptions', function () {
  it('Empty input', function () {
    const input = {};
    const expected = '';
    expect(buildCompilerOptions(input)).toEqual(expected);
  });
  it('TypeScript config file', function () {
    const input = {
      typescript: {
        configPath: './tsconfig.json',
      },
    };
    const expected = `typescript.configPath='./tsconfig.json'`;
    expect(buildCompilerOptions(input)).toEqual(expected);
  });
  it('CustomCompilerPath set', function () {
    const input = {
      typescript: {
        customCompilerModulePath: '/path/to/custom/compiler',
      },
    };
    const expected = `typescript.customCompilerModulePath='/path/to/custom/compiler'`;
    expect(buildCompilerOptions(input)).toEqual(expected);
  });
  it('With options', function () {
    const input = {
      typescript: {
        options: {
          allowUnusedLabels: true,
          noFallthroughCasesInSwitch: true,
          allowUmdGlobalAccess: true,
        },
      },
    };
    const expected = 'typescript.options.allowUnusedLabels=true,typescript.options.noFallthroughCasesInSwitch=true,typescript.options.allowUmdGlobalAccess=true';
    expect(buildCompilerOptions(input)).toEqual(expected);
  });
  it('All with options', function () {
    const input = {
      typescript: {
        configPath: './tsconfig.json',
        customCompilerModulePath: '/path/to/custom/compiler',
        options: {
          allowUnusedLabels: true,
          noFallthroughCasesInSwitch: true,
          allowUmdGlobalAccess: true,
        },
      },
    };
    const expected = `typescript.configPath='./tsconfig.json',typescript.customCompilerModulePath='/path/to/custom/compiler',typescript.options.allowUnusedLabels=true,typescript.options.noFallthroughCasesInSwitch=true,typescript.options.allowUmdGlobalAccess=true`;
    expect(buildCompilerOptions(input)).toEqual(expected);
  });
});
