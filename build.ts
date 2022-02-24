const CMD = Deno.build.os === "windows" ? "cmd /c " : "";
const script = CMD +
  "deno run -A --no-check --unstable ./_core/build_script.ts";
const p = Deno.run({
  cmd: script.split(" "),
  stdout: "piped",
  stderr: "piped",
});

const { code } = await p.status();
const rawOutput = await p.output();
const rawError = await p.stderrOutput();

if (code === 0) {
  await Deno.stdout.write(rawOutput);
} else {
  const errorString = new TextDecoder().decode(rawError);
  console.log(errorString);
}

Deno.exit(code);
