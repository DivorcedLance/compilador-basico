## Test:

``wgha`

$$
\begin{aligned}
& SD(2) &= &\{+\} \\
& SD(3) &= &\{-\} \\
& SD(4) &= &\{EOF, , )\} \\
& SD(6) &= &\{*\} \\
& SD(7) &= &\{\} \\
& SD(8) &= &\{+,-,EOF, , )\} \\
& SD(10) &= &\{\} \\
& SD(11) &= &\{*,/,+,-,EOF,, )\} \\
& SD(12) &= &\{(\} \\
& SD(13) &= &\{ID\} \\
& SD(14) &= &\{NUM\} \\
\end{aligned}
$$

$$
\begin{aligned}
&1. &E &\implies TX \\
X\\
&2. &X &\implies +E \\
&3. &X &\implies -E \\
&4. &X &\implies \lambda \\
\\
&5. &T &\implies FY \\
Y\\
&6. &Y &\implies *T \\
&7. &Y &\implies /T \\
&8. &Y &\implies \lambda \\
\\
&9. &F &\implies GZ \\
Z\\
&10. &Z &\implies ^F \\
&11. &Z &\implies \lambda \\
G\\
&12. &G &\implies (E) \\
&13. &G &\implies ID \\
&14. &G &\implies NUM \\
\end{aligned}
$$
